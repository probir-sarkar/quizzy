import { getAllHoroscopesForDate } from "@/queries/horoscope";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { unstable_cache } from "next/cache";
import { format, parseISO, isValid, startOfMonth } from "date-fns";
import { ZodiacSign } from "@/generated/prisma/client";
import Image from "next/image";

const zodiacSignInfo = {
  ARIES: { symbol: "/zodiac/aries.svg", dates: "Mar 21 - Apr 19", element: "Fire", accentColor: "text-red-600" },
  TAURUS: { symbol: "/zodiac/taurus.svg", dates: "Apr 20 - May 20", element: "Earth", accentColor: "text-green-600" },
  GEMINI: { symbol: "/zodiac/gemini.svg", dates: "May 21 - Jun 20", element: "Air", accentColor: "text-yellow-600" },
  CANCER: { symbol: "/zodiac/cancer.svg", dates: "Jun 21 - Jul 22", element: "Water", accentColor: "text-blue-600" },
  LEO: { symbol: "/zodiac/leo.svg", dates: "Jul 23 - Aug 22", element: "Fire", accentColor: "text-orange-600" },
  VIRGO: { symbol: "/zodiac/virgo.svg", dates: "Aug 23 - Sep 22", element: "Earth", accentColor: "text-emerald-600" },
  LIBRA: { symbol: "/zodiac/libra.svg", dates: "Sep 23 - Oct 22", element: "Air", accentColor: "text-pink-600" },
  SCORPIO: {
    symbol: "/zodiac/scorpio.svg",
    dates: "Oct 23 - Nov 21",
    element: "Water",
    accentColor: "text-purple-600"
  },
  SAGITTARIUS: {
    symbol: "/zodiac/sagittarius.svg",
    dates: "Nov 22 - Dec 21",
    element: "Fire",
    accentColor: "text-indigo-600"
  },
  CAPRICORN: {
    symbol: "/zodiac/capricorn.svg",
    dates: "Dec 22 - Jan 19",
    element: "Earth",
    accentColor: "text-slate-600"
  },
  AQUARIUS: { symbol: "/zodiac/aquarius.svg", dates: "Jan 20 - Feb 18", element: "Air", accentColor: "text-cyan-600" },
  PISCES: { symbol: "/zodiac/pisces.svg", dates: "Feb 19 - Mar 20", element: "Water", accentColor: "text-violet-600" }
};

const getElementColor = (element: string) => {
  switch (element) {
    case "Fire":
      return "bg-red-100 text-red-800 border-red-200";
    case "Earth":
      return "bg-green-100 text-green-800 border-green-200";
    case "Air":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Water":
      return "bg-cyan-100 text-cyan-800 border-cyan-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getHoroscopesForDateCached = unstable_cache(
  async (date: Date) => {
    return getAllHoroscopesForDate(date);
  },
  ["horoscopes-by-date"],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ["horoscopes"]
  }
);

export default async function HoroscopePage({ searchParams }: { searchParams: { date?: string; month?: string } }) {
  // Parse the date from query params or use today
  let selectedDate = new Date();

  if (searchParams.date) {
    const parsedDate = parseISO(searchParams.date);
    if (isValid(parsedDate)) {
      selectedDate = parsedDate;
    }
  } else if (searchParams.month) {
    const parsedMonth = parseISO(searchParams.month);
    if (isValid(parsedMonth)) {
      selectedDate = parsedMonth;
    }
  }

  const horoscopes = await getHoroscopesForDateCached(selectedDate);
  const formattedDate = format(selectedDate, "EEEE, MMMM d, yyyy");
  const currentMonth = startOfMonth(selectedDate);

  // Create a map of zodiac signs to horoscopes for easy lookup
  const horoscopeMap = new Map(horoscopes.map((h) => [h.zodiacSign, h]));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Daily Horoscopes
        </h1>
        <p className="text-muted-foreground text-lg">Discover what the stars have in store for you today</p>
        <p className="text-sm text-muted-foreground mt-2">{formattedDate}</p>
      </div>

      {/* Zodiac Signs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(zodiacSignInfo).map(([sign, info]) => {
          const horoscope = horoscopeMap.get(sign as ZodiacSign);

          return (
            <Card key={sign} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-violet-600">
                    <Image
                      src={info.symbol}
                      alt={`${sign} symbol`}
                      width={40}
                      height={40}
                      className={`${info.accentColor} w-10 h-10`}
                    />
                    <div>
                      <CardTitle className="text-xl">{sign}</CardTitle>
                      <p className="text-sm text-muted-foreground">{info.dates}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${getElementColor(info.element)}`}>
                    {info.element}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {horoscope ? (
                  <div className="space-y-4">
                    <p className="text-sm leading-relaxed">{horoscope.description}</p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {horoscope.luckyColor && (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="font-medium">Lucky Color:</span>
                          <span className="text-muted-foreground">{horoscope.luckyColor}</span>
                        </div>
                      )}
                      {horoscope.luckyNumber && (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="font-medium">Lucky Number:</span>
                          <span className="text-muted-foreground">{horoscope.luckyNumber}</span>
                        </div>
                      )}
                      {horoscope.mood && (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="font-medium">Mood:</span>
                          <span className="text-muted-foreground">{horoscope.mood}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">Horoscope not available for today</p>
                    <p className="text-xs mt-1">Check back later for cosmic insights</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="mt-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">About Daily Horoscopes</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our daily horoscopes are generated using astrological insights and AI technology to provide you with
            personalized guidance for each day. Whether you&apos;re seeking advice on love, career, or personal growth,
            discover what the universe has in store for your zodiac sign.
          </p>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
