import { getAllHoroscopesForDate } from "@/queries/horoscope";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cacheTag, cacheLife } from "next/cache";
import { format, parseISO, isValid, startOfMonth, addDays, subDays, parse } from "date-fns";
import { ZodiacSign } from "@quizzy/prisma/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { UTCDate } from "@date-fns/utc";
import { headers } from "next/headers";

async function getHoroscopesForDateCached(date: Date) {
  return getAllHoroscopesForDate(date);
}

const zodiacSignInfo = {
  ARIES: {
    symbol: "/zodiac/aries.svg",
    dates: "Mar 21 - Apr 19",
    element: "Fire",
    accentColor: "text-red-600 dark:text-red-400"
  },
  TAURUS: {
    symbol: "/zodiac/taurus.svg",
    dates: "Apr 20 - May 20",
    element: "Earth",
    accentColor: "text-green-600 dark:text-green-400"
  },
  GEMINI: {
    symbol: "/zodiac/gemini.svg",
    dates: "May 21 - Jun 20",
    element: "Air",
    accentColor: "text-yellow-600 dark:text-yellow-400"
  },
  CANCER: {
    symbol: "/zodiac/cancer.svg",
    dates: "Jun 21 - Jul 22",
    element: "Water",
    accentColor: "text-blue-600 dark:text-blue-400"
  },
  LEO: {
    symbol: "/zodiac/leo.svg",
    dates: "Jul 23 - Aug 22",
    element: "Fire",
    accentColor: "text-orange-600 dark:text-orange-400"
  },
  VIRGO: {
    symbol: "/zodiac/virgo.svg",
    dates: "Aug 23 - Sep 22",
    element: "Earth",
    accentColor: "text-emerald-600 dark:text-emerald-400"
  },
  LIBRA: {
    symbol: "/zodiac/libra.svg",
    dates: "Sep 23 - Oct 22",
    element: "Air",
    accentColor: "text-pink-600 dark:text-pink-400"
  },
  SCORPIO: {
    symbol: "/zodiac/scorpio.svg",
    dates: "Oct 23 - Nov 21",
    element: "Water",
    accentColor: "text-purple-600 dark:text-purple-400"
  },
  SAGITTARIUS: {
    symbol: "/zodiac/sagittarius.svg",
    dates: "Nov 22 - Dec 21",
    element: "Fire",
    accentColor: "text-indigo-600 dark:text-indigo-400"
  },
  CAPRICORN: {
    symbol: "/zodiac/capricorn.svg",
    dates: "Dec 22 - Jan 19",
    element: "Earth",
    accentColor: "text-slate-600 dark:text-slate-400"
  },
  AQUARIUS: {
    symbol: "/zodiac/aquarius.svg",
    dates: "Jan 20 - Feb 18",
    element: "Air",
    accentColor: "text-cyan-600 dark:text-cyan-400"
  },
  PISCES: {
    symbol: "/zodiac/pisces.svg",
    dates: "Feb 19 - Mar 20",
    element: "Water",
    accentColor: "text-violet-600 dark:text-violet-400"
  }
};

const getElementColor = (element: string) => {
  switch (element) {
    case "Fire":
      return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800";
    case "Earth":
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800";
    case "Air":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    case "Water":
      return "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800";
    default:
      return "bg-gray-100 dark:bg-gray-800/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
  }
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function HoroscopePage({ searchParams }: Props) {
  // Parse the date from query params or use today
  const { date } = await searchParams;
  let selectedDate = new UTCDate();

  if (date) {
    const parsedDate = parse(date, "yyyy-MM-dd", new UTCDate());
    if (isValid(parsedDate)) {
      selectedDate = parsedDate;
    }
  }

  const horoscopes = await getHoroscopesForDateCached(selectedDate);
  const formattedDate = format(selectedDate, "EEEE, MMMM d, yyyy");

  // Calculate navigation dates
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for comparison
  selectedDate.setHours(0, 0, 0, 0);

  const previousDate = subDays(selectedDate, 1);
  const nextDate = addDays(selectedDate, 1);
  const canGoNext = nextDate <= today; // Prevent going to future dates

  // Create a map of zodiac signs to horoscopes for easy lookup
  const horoscopeMap = new Map(horoscopes.map((h) => [h.zodiacSign, h]));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400 bg-clip-text text-transparent animate-gradient">
              Daily Horoscopes
            </h1>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 rounded-full mb-6"></div>
          </div>
          <p className="text-xl text-muted-foreground dark:text-gray-300 mb-2">
            Discover what the stars have in store for you today
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border border-purple-200 dark:border-purple-800">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Zodiac Signs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {Object.entries(zodiacSignInfo).map(([sign, info]) => {
            const horoscope = horoscopeMap.get(sign as ZodiacSign);

            return (
              <Card
                key={sign}
                className="group relative overflow-hidden border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/90 dark:hover:bg-slate-800/90 before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-white/20 before:to-transparent dark:before:from-transparent dark:before:via-purple-900/10 dark:before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500"
              >
                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Image
                          src={info.symbol}
                          alt={`${sign} symbol`}
                          width={48}
                          height={48}
                          className={`${info.accentColor} w-12 h-12 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12`}
                        />
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-600 dark:to-pink-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                          {sign}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">{info.dates}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getElementColor(
                        info.element
                      )} font-medium text-xs px-2 py-1 transition-all duration-300 group-hover:scale-105`}
                    >
                      {info.element}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 relative z-10">
                  {horoscope ? (
                    <div className="space-y-4">
                      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300  transition-all duration-300">
                        {horoscope.description}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {horoscope.luckyColor && (
                          <div className="flex items-center gap-1 text-xs px-2 py-1 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full border border-purple-200 dark:border-purple-700">
                            <span className="font-medium text-purple-700 dark:text-purple-300">Lucky Color:</span>
                            <span className="text-muted-foreground dark:text-gray-400">{horoscope.luckyColor}</span>
                          </div>
                        )}
                        {horoscope.luckyNumber && (
                          <div className="flex items-center gap-1 text-xs px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full border border-blue-200 dark:border-blue-700">
                            <span className="font-medium text-blue-700 dark:text-blue-300">Lucky Number:</span>
                            <span className="text-muted-foreground dark:text-gray-400">{horoscope.luckyNumber}</span>
                          </div>
                        )}
                        {horoscope.mood && (
                          <div className="flex items-center gap-1 text-xs px-2 py-1 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full border border-green-200 dark:border-green-700">
                            <span className="font-medium text-green-700 dark:text-green-300">Mood:</span>
                            <span className="text-muted-foreground dark:text-gray-400">{horoscope.mood}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground dark:text-gray-400">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                        <span className="text-2xl">✨</span>
                      </div>
                      <p className="text-sm font-medium">Horoscope not available</p>
                      <p className="text-xs mt-1">Check back later for cosmic insights</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-purple-200 dark:border-purple-700 hover:bg-white dark:hover:bg-slate-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:scale-105"
          >
            <a href={`?date=${format(previousDate, "yyyy-MM-dd")}`} className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </a>
          </Button>

          <Button
            variant={selectedDate.getTime() === today.getTime() ? "default" : "outline"}
            size="sm"
            asChild
            disabled={selectedDate.getTime() === today.getTime()}
            className={
              selectedDate.getTime() === today.getTime()
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                : "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-purple-200 dark:border-purple-700 hover:bg-white dark:hover:bg-slate-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:scale-105"
            }
          >
            {selectedDate.getTime() !== today.getTime() ? (
              <Link href="/horoscope" className="flex items-center gap-2">
                Today
              </Link>
            ) : (
              <span className="flex items-center gap-2">Today</span>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            disabled={!canGoNext}
            className={`bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-purple-200 dark:border-purple-700 hover:bg-white dark:hover:bg-slate-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:scale-105 ${
              !canGoNext ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {canGoNext ? (
              <Link href={`?date=${format(nextDate, "yyyy-MM-dd")}`} className="flex items-center gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="flex items-center gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <div className="max-w-3xl mx-auto bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl p-8 border border-purple-100 dark:border-purple-800/50 shadow-xl">
            <div className="inline-block">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                About Daily Horoscopes
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 rounded-full mb-6"></div>
            </div>
            <p className="text-muted-foreground dark:text-gray-300 leading-relaxed text-lg">
              Our daily horoscopes are generated using astrological insights and AI technology to provide you with
              personalized guidance for each day. Whether you&apos;re seeking advice on love, career, or personal
              growth, discover what the universe has in store for your zodiac sign.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground dark:text-gray-400">
              <span className="flex items-center gap-1">⭐ Cosmic Insights</span>
              <span>•</span>
              <span className="flex items-center gap-1">🔮 AI-Powered</span>
              <span>•</span>
              <span className="flex items-center gap-1">🌙 Daily Updates</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
