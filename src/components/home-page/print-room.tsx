import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

/**
 * Editorial band pairing display type with framed grayscale plates —
 * the home-page sibling of the horoscope/history heroes.
 */
export default function PrintRoom() {
  return (
    <section className="border-y-2 border-foreground">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-5">
          <Reveal y={12}>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
              From the print room
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-sans text-4xl font-black uppercase leading-[0.9] tracking-[-0.02em] sm:text-6xl">
              Read. Play.
              <br />
              <span className="border-b-8 border-cyan-300">Argue.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
              Every quiz is typeset like a page from the archive — honest questions, instant verdicts, and
              explanations you can quote at dinner. No accounts, no paywall, no mercy.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href="/category"
              className="pop-hover mt-8 inline-flex items-center gap-2 border-2 border-foreground bg-foreground px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-background shadow-pop [--pop:var(--pop-cyan)]"
            >
              Browse the Archive
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        {/* Overlapping plates */}
        <div className="lg:col-span-7">
          <Reveal delay={0.1} className="flex flex-wrap items-start justify-center gap-8 sm:gap-10">
            <figure className="pop-hover w-52 rotate-[-2deg] border-2 border-foreground bg-card p-3 shadow-pop [--pop:var(--pop-violet)] [--pop-x:8px] [--pop-y:8px] sm:w-60">
              <Image
                src="/images/typewriter.jpg"
                alt="Vintage Corona typewriter with round keys"
                width={990}
                height={1296}
                className="border border-foreground/40 grayscale"
              />
              <figcaption className="flex items-center justify-between px-1 pt-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                <span>Fig. 01</span>
                <span>The typesetter</span>
              </figcaption>
            </figure>

            <figure className="pop-hover mt-10 w-52 rotate-[2.5deg] border-2 border-foreground bg-card p-3 shadow-pop [--pop:var(--pop-amber)] [--pop-x:8px] [--pop-y:8px] sm:w-60 sm:mt-16">
              <Image
                src="/images/library.jpg"
                alt="Narrow aisle between towering library bookshelves"
                width={1066}
                height={1600}
                className="border border-foreground/40 grayscale"
              />
              <figcaption className="flex items-center justify-between px-1 pt-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                <span>Fig. 02</span>
                <span>The archive</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
