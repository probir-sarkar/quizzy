import { DatePickerClient } from "@/components/this-day-in-history/date-picker-client";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { client } from "@/lib/orpc";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const CATEGORY_LABELS: Record<string, string> = {
  war: "War & Conflict",
  discovery: "Discovery",
  politics: "Politics",
  science: "Science",
  art: "Art & Culture",
  sports: "Sports",
  technology: "Technology",
  medicine: "Medicine",
  exploration: "Exploration",
  literature: "Literature",
  music: "Music",
  economy: "Economy",
  religion: "Religion",
  disaster: "Disaster",
  revolution: "Revolution",
  invention: "Invention"
};

const CATEGORY_CHIP: Record<string, string> = {
  war: "bg-rose-300",
  discovery: "bg-lime-300",
  politics: "bg-blue-300",
  science: "bg-violet-300",
  art: "bg-amber-300",
  sports: "bg-amber-300",
  technology: "bg-cyan-300",
  medicine: "bg-lime-300",
  exploration: "bg-blue-300",
  literature: "bg-violet-300",
  music: "bg-rose-300",
  economy: "bg-amber-300",
  religion: "bg-cyan-300",
  disaster: "bg-rose-300",
  revolution: "bg-lime-300",
  invention: "bg-cyan-300"
};

const chipFor = (category: string) => CATEGORY_CHIP[category] ?? "bg-muted";

export default async function ThisDayInHistoryPage({ searchParams }: Props) {
  const { month, day } = await searchParams;

  // Get events for the selected date (API defaults to today if not provided)
  const response = await client.getPastEventsByMonthDay({
    month: month ? Number(month) : undefined,
    day: day ? Number(day) : undefined
  });

  const eventsList = response?.events ?? [];
  const selectedMonth = response?.month ?? new Date().getMonth() + 1;
  const selectedDay = response?.day ?? new Date().getDate();
  const formattedDate = `${monthNames[selectedMonth - 1]} ${selectedDay}`;

  const today = new Date();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b-2 border-foreground">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-4 pt-28 pb-12 sm:px-6 md:pt-36 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal y={12}>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                The archive — {formattedDate}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-4 max-w-5xl font-sans text-5xl font-black uppercase leading-[0.88] tracking-[-0.02em] sm:text-7xl lg:text-8xl">
                This day <span className="font-mono text-[0.5em] font-bold italic tracking-tight">in</span> history
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
                Remarkable events pulled from the archive for {formattedDate}. Some changed the world, some just made
                the papers — all of them happened on this date.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="rule-dotted mt-8 flex flex-wrap gap-x-12 gap-y-4 pt-6 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                <span>
                  <strong className="mr-2 font-sans text-2xl font-black tracking-tight text-foreground tabular-nums">
                    {eventsList.length}
                  </strong>
                  events filed
                </span>
                {eventsList.length > 0 && (
                  <span>
                    <strong className="mr-2 font-sans text-2xl font-black tracking-tight text-foreground tabular-nums">
                      {new Set(eventsList.map((e) => e.category)).size}
                    </strong>
                    categories
                  </span>
                )}
              </div>
            </Reveal>
          </div>

          {/* Newspaper plate */}
          <Reveal delay={0.1} className="hidden justify-center lg:col-span-4 lg:flex">
            <figure className="pop-hover relative w-72 rotate-2 border-2 border-foreground bg-card p-3 shadow-pop [--pop:var(--pop-amber)] [--pop-x:10px] [--pop-y:10px] xl:w-80">
              <Image
                src="/images/newspapers.jpg"
                alt="Stack of folded vintage newspapers"
                width={1573}
                height={1073}
                className="border border-foreground/40 grayscale"
              />
              <figcaption className="flex items-center justify-between px-1 pt-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                <span>Fig. 01</span>
                <span>The morning papers</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Date picker */}
      <section className="border-b-2 border-foreground bg-muted/40">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
            Turn the pages of the calendar
          </p>
          <DatePickerClient
            selectedMonth={selectedMonth}
            selectedDay={selectedDay}
            formattedDate={formattedDate}
            monthNames={monthNames}
            today={today}
          />
        </div>
      </section>

      {/* Events timeline */}
      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
        {eventsList.length === 0 ? (
          <div className="border-2 border-dashed border-foreground/40 py-20 text-center">
            <h2 className="font-sans text-3xl font-black uppercase tracking-tight">Nothing in the file</h2>
            <p className="mx-auto mt-3 max-w-md font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              No events recorded for {formattedDate}. Pick another date — history was busy elsewhere.
            </p>
          </div>
        ) : (
          <Stagger gap={0.05} className="border-t-2 border-foreground">
            {eventsList.map((event) => (
              <StaggerItem key={event.id}>
                <article className="grid grid-cols-1 gap-4 border-b-2 border-dotted border-foreground/40 py-8 md:grid-cols-12 md:gap-8">
                  {/* Year */}
                  <div className="md:col-span-2">
                    <p className="font-sans text-4xl font-black tracking-tight tabular-nums sm:text-5xl">
                      {event.year < 0 ? `${Math.abs(event.year)}` : event.year}
                    </p>
                    <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                      {event.year < 0 ? "BCE" : "CE"}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 md:col-span-10">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em]">
                        <span aria-hidden className={`inline-block h-2.5 w-2.5 border border-foreground ${chipFor(event.category)}`} />
                        {CATEGORY_LABELS[event.category] ?? event.category}
                      </span>
                    </div>

                    <h3 className="mt-2 font-sans text-xl font-black uppercase leading-tight tracking-tight sm:text-2xl lg:text-3xl">
                      {event.title}
                    </h3>
                    <p className="mt-2 max-w-3xl font-sans text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {event.description}
                    </p>

                    {event.tags && event.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {event.tags.slice(0, 6).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="rounded-full border-2 border-foreground/70 px-3 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                        {event.tags.length > 6 && (
                          <span className="rounded-full border-2 border-foreground/70 px-3 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                            +{event.tags.length - 6}
                          </span>
                        )}
                      </div>
                    )}

                    {event.sourceUrls && event.sourceUrls.length > 0 && (
                      <a
                        href={event.sourceUrls[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group mt-4 inline-flex items-center gap-2 border-2 border-foreground bg-background px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition-colors hover:bg-foreground hover:text-background"
                      >
                        Read the source
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    )}
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>
    </div>
  );
}
