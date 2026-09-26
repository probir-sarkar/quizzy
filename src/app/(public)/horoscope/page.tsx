import Image from "next/image";
import { format, addDays, subDays, parse } from "date-fns";
import { ZodiacSign } from "@/lib/enums";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { UTCDate } from "@date-fns/utc";
import { client } from "@/lib/orpc";
import { ZODIAC_SIGN_INFO } from "@/lib/zodiac-constants";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Reveal } from "@/components/motion/reveal";

type HoroscopeWithSign = {
  zodiacSign: ZodiacSign;
  description: string | null;
  luckyColor: string | null;
  luckyNumber: number | null;
  mood: string | null;
};

async function getHoroscopesForDateCached(date?: string): Promise<HoroscopeWithSign[]> {
  const data = await client.getAllHoroscopesForDate({ date });
  return data ?? [];
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const ELEMENT_CHIP: Record<string, string> = {
  Fire: "bg-rose-300",
  Earth: "bg-lime-300",
  Air: "bg-cyan-300",
  Water: "bg-violet-300"
};

const SIGN_POP = [
  "var(--pop-violet)",
  "var(--pop-lime)",
  "var(--pop-cyan)",
  "var(--pop-rose)",
  "var(--pop-amber)",
  "var(--pop-blue)"
];

export default async function HoroscopePage({ searchParams }: Props) {
  const { date } = await searchParams;

  const horoscopes = await getHoroscopesForDateCached(date);

  // Parse date for display (API defaults to today if not provided)
  const selectedDate = date ? parse(date, "yyyy-MM-dd", new UTCDate()) : new UTCDate();

  const formattedDate = format(selectedDate, "EEEE, MMMM d, yyyy");

  // Calculate navigation dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  const previousDate = subDays(selectedDate, 1);
  const nextDate = addDays(selectedDate, 1);
  const canGoNext = nextDate <= today;

  const horoscopeMap = new Map(horoscopes.map((h: HoroscopeWithSign) => [h.zodiacSign, h]));
  const isToday = selectedDate.getTime() === today.getTime();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b-2 border-foreground">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-4 pt-28 pb-14 sm:px-6 md:pt-36 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal y={12}>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                The stars, filed daily — {formattedDate}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-4 font-sans text-5xl font-black uppercase leading-[0.88] tracking-[-0.02em] sm:text-7xl lg:text-8xl">
                Daily
                <br />
                <span className="font-mono text-[0.55em] font-bold italic tracking-tight">horo</span>scopes
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-lg font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
                Twelve signs, one broadsheet. Astrological insights served straight, no sugar coating — check your
                sign, then blame the planets.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <NavPill href={`?date=${format(previousDate, "yyyy-MM-dd")}`}>
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </NavPill>
                {isToday ? (
                  <span className="inline-flex cursor-not-allowed items-center gap-2 border-2 border-foreground/40 px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Today
                  </span>
                ) : (
                  <NavPill href="/horoscope" inverted>
                    Today
                  </NavPill>
                )}
                {canGoNext ? (
                  <NavPill href={`?date=${format(nextDate, "yyyy-MM-dd")}`}>
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </NavPill>
                ) : (
                  <span className="inline-flex cursor-not-allowed items-center gap-2 border-2 border-foreground/40 px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </span>
                )}
              </div>
            </Reveal>
          </div>

          {/* Star chart plate */}
          <Reveal delay={0.1} className="hidden justify-center lg:col-span-5 lg:flex">
            <figure className="pop-hover relative w-72 rotate-2 border-2 border-foreground bg-card p-3 shadow-pop [--pop:var(--pop-violet)] [--pop-x:10px] [--pop-y:10px] xl:w-80">
              <Image
                src="/images/celestial-map.jpg"
                alt="Antique engraved celestial star chart"
                width={1025}
                height={1200}
                className="border border-foreground/40 grayscale"
                priority
              />
              <figcaption className="flex items-center justify-between px-1 pt-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                <span>Fig. 12</span>
                <span className="flex items-center gap-1.5">
                  <Star className="h-3 w-3 fill-current" />
                  The zodiac
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Signs grid */}
      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
        <Stagger gap={0.03} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Object.entries(ZODIAC_SIGN_INFO).map(([sign, info], i) => {
            const horoscope = horoscopeMap.get(sign as ZodiacSign);

            return (
              <StaggerItem key={sign} className="h-full">
                <article
                  className="pop-hover flex h-full flex-col border-2 border-foreground bg-card shadow-pop [--pop-x:6px] [--pop-y:6px]"
                  style={{ "--pop": SIGN_POP[i % SIGN_POP.length] } as React.CSSProperties}
                >
                  <div className="flex items-center justify-between border-b-2 border-dotted border-foreground/40 px-4 py-3">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")} — {info.dates}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
                      <span aria-hidden className={`inline-block h-2.5 w-2.5 border border-foreground ${ELEMENT_CHIP[info.element] ?? "bg-muted"}`} />
                      {info.element}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-3">
                      <Image
                        src={info.symbol}
                        alt={`${sign} symbol`}
                        width={40}
                        height={40}
                        className="h-10 w-10 grayscale"
                      />
                      <h3 className="font-sans text-2xl font-black uppercase tracking-tight">
                        {sign.charAt(0) + sign.slice(1).toLowerCase()}
                      </h3>
                    </div>

                    {horoscope ? (
                      <div className="mt-4 flex flex-1 flex-col">
                        <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                          {horoscope.description}
                        </p>
                        <div className="rule-dotted mt-auto flex flex-wrap gap-x-5 gap-y-1 pt-4 font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
                          {horoscope.luckyNumber && <span>Nº {horoscope.luckyNumber}</span>}
                          {horoscope.luckyColor && <span>{horoscope.luckyColor}</span>}
                          {horoscope.mood && <span>{horoscope.mood}</span>}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 flex flex-1 items-center border-2 border-dashed border-foreground/30 p-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          The stars are quiet today — check back later
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* About */}
      <section className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-6">
        <Reveal>
          <div className="border-2 border-foreground bg-card shadow-pop [--pop:var(--pop-blue)] [--pop-x:8px] [--pop-y:8px]">
            <div className="border-b-2 border-dotted border-foreground/40 px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
              About this page
            </div>
            <div className="grid gap-8 p-6 sm:grid-cols-3 sm:p-8">
              <p className="font-sans text-base leading-relaxed text-muted-foreground sm:col-span-2 sm:text-lg">
                Our daily horoscopes blend astrological insight with a plain-language translation. Read them for
                guidance on love, career, and personal growth — or purely for the drama. New readings land every
                morning for all twelve signs.
              </p>
              <ul className="space-y-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em]">
                <li className="flex items-center gap-2">
                  <span aria-hidden className="h-2.5 w-2.5 border border-foreground bg-rose-300" /> Cosmic insights
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden className="h-2.5 w-2.5 border border-foreground bg-cyan-300" /> Daily updates
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden className="h-2.5 w-2.5 border border-foreground bg-lime-300" /> Zero sugar coating
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function NavPill({ href, children, inverted = false }: { href: string; children: React.ReactNode; inverted?: boolean }) {
  return (
    <Link
      href={href}
      className={`pop-hover inline-flex items-center gap-2 border-2 border-foreground px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] shadow-pop [--pop-x:3px] [--pop-y:3px] ${
        inverted
          ? "bg-foreground text-background [--pop:var(--pop-lime)]"
          : "bg-background hover:bg-foreground hover:text-background [--pop:var(--pop-cyan)]"
      }`}
    >
      {children}
    </Link>
  );
}
