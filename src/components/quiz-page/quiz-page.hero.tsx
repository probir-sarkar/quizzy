import { QuizDifficulty } from "@/lib/enums";
import { cn } from "@/lib/utils";

import { BreadcrumbItem } from "../common/Breadcrumbs";
import Breadcrumbs from "../common/Breadcrumbs";
import { Reveal } from "@/components/motion/reveal";
import type { QuizDetailDto } from "@/server/quiz";

type QuizPageHeroProps = QuizDetailDto;

const DIFFICULTY_CHIP: Record<string, string> = {
  [QuizDifficulty.easy]: "bg-lime-300",
  [QuizDifficulty.medium]: "bg-amber-300",
  [QuizDifficulty.hard]: "bg-rose-300"
};

export default function QuizHero({ quiz, breadcrumbs }: { quiz: QuizPageHeroProps; breadcrumbs: BreadcrumbItem[] }) {
  if (!quiz) return null;

  const difficulty = (quiz.difficulty as QuizDifficulty) ?? QuizDifficulty.easy;

  return (
    <div className="border-b-2 border-foreground">
      <div className="mx-auto max-w-[1400px] px-4 pt-28 pb-12 sm:px-6 md:pt-36">
        <Reveal y={12}>
          <Breadcrumbs items={breadcrumbs} />
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
            {quiz.category?.name || "General"} — {quiz._count.questions} questions
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="mt-3 max-w-5xl font-sans text-4xl font-black uppercase leading-[0.95] tracking-[-0.02em] wrap-break-word sm:text-6xl lg:text-7xl">
            {quiz.title}
          </h1>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
            {quiz.description || "Challenge yourself with this expertly curated quiz and see how you rank!"}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <span
              className={cn(
                "inline-flex items-center gap-2 border-2 border-foreground px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em]",
                DIFFICULTY_CHIP[difficulty] ?? "bg-foreground text-background"
              )}
            >
              <span className="text-[color:var(--foreground)]">{difficulty}</span>
            </span>
            {quiz.tags.map((tag) => (
              <span
                key={tag.tagId}
                className="rounded-full border-2 border-foreground px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition-colors hover:bg-foreground hover:text-background"
              >
                #{tag.tag.name}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
