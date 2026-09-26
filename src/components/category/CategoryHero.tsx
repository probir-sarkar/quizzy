"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";

import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";

export type CategoryPageType = {
  name: string;
  slug: string;
  quizCount: number;
  subCategryCount: number;
};

const POP_CYCLE = ["var(--pop-violet)", "var(--pop-lime)", "var(--pop-cyan)", "var(--pop-rose)", "var(--pop-amber)", "var(--pop-blue)"];

export default function CategoryHero({ category }: { category: CategoryPageType }) {
  const pop = useMemo(() => {
    if (!category.slug) return POP_CYCLE[0];
    let h = 0;
    for (let i = 0; i < category.slug.length; i++) h = (h << 5) - h + category.slug.charCodeAt(i);
    return POP_CYCLE[Math.abs(h) % POP_CYCLE.length];
  }, [category.slug]);

  if (!category) return null;

  const description = `Every quiz we publish under ${category.name}. Filter by sub-topic, keep honest score, and work your way through the archive.`;

  return (
    <section className="border-b-2 border-foreground">
      <div className="mx-auto max-w-[1400px] px-4 pt-28 pb-12 sm:px-6 md:pt-36">
        <Reveal y={12}>
          <Link
            href="/category"
            className="group inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            All categories
          </Link>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
            Category file — {category.quizCount} {category.quizCount === 1 ? "entry" : "entries"}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h1
            className="mt-3 inline-block border-b-8 font-sans text-5xl font-black uppercase leading-[0.9] tracking-[-0.02em] wrap-break-word sm:text-7xl lg:text-8xl"
            style={{ borderBottomColor: pop }}
          >
            {category.name}
          </h1>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="rule-dotted mt-8 flex gap-12 pt-6">
            <div>
              <CountUp value={category.quizCount} className="font-sans text-4xl font-black tabular-nums sm:text-5xl" />
              <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Quizzes
              </p>
            </div>
            <div>
              <CountUp value={category.subCategryCount} className="font-sans text-4xl font-black tabular-nums sm:text-5xl" />
              <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Sub-topics
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
