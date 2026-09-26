"use client";

import { ArrowUpRight } from "lucide-react";
import type { QuizCardDto as QuizCard } from "@/server/quiz";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

interface TrendingSectionProps {
  quizzes: QuizCard[];
}

export default function TrendingSection({ quizzes }: TrendingSectionProps) {
  if (!quizzes || quizzes.length === 0) return null;

  return (
    <section id="trending" className="mx-auto max-w-[1400px] px-4 pt-20 sm:px-6">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
            Most played this week
          </p>
          <h2 className="font-sans text-4xl font-black uppercase tracking-tight sm:text-6xl">Trending</h2>
        </div>
        <p className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:block">
          ( {quizzes.length} entries )
        </p>
      </header>

      <ol className="border-t-2 border-foreground">
        {quizzes.map((quiz, i) => (
          <TrendingRow key={quiz.id} quiz={quiz} index={i} />
        ))}
      </ol>
    </section>
  );
}

function TrendingRow({ quiz, index }: { quiz: QuizCard; index: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.2), ease: [0.16, 1, 0.3, 1] }}
      className="border-b-2 border-dotted border-foreground/40 last:border-b-2 last:border-solid last:border-foreground/0"
    >
      <Link
        href={`/quiz/${quiz.slug}`}
        className="group flex items-center gap-4 px-1 py-5 transition-colors duration-200 hover:bg-foreground sm:gap-8 sm:px-4"
      >
        <span className="font-mono text-sm font-bold text-muted-foreground transition-colors group-hover:text-background/70 sm:text-base">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="font-sans text-xl font-black uppercase leading-tight tracking-tight transition-colors group-hover:text-background sm:text-3xl">
            {quiz.title}
          </h3>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-background/70 sm:text-[11px]">
            {quiz.category?.name ?? "General"} — {quiz._count.questions} questions — {quiz.difficulty}
          </p>
        </div>

        <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-foreground transition-all duration-200 group-hover:rotate-45 group-hover:border-background group-hover:bg-lime-300 group-hover:text-foreground sm:h-12 sm:w-12">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </Link>
    </motion.li>
  );
}
