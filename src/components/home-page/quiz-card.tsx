import { ArrowUpRight } from "lucide-react";
import type { QuizCardDto as QuizCardType } from "@/server/quiz";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

type Difficulty = "easy" | "medium" | "hard";

const POP_COLORS = [
  "var(--pop-violet)",
  "var(--pop-lime)",
  "var(--pop-cyan)",
  "var(--pop-rose)",
  "var(--pop-amber)",
  "var(--pop-blue)"
] as const;

export function QuizCard({ quiz, index }: { quiz: QuizCardType; index: number }) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Link to="/quiz/$slug" params={{ slug: quiz.slug }} className="block h-full">
        <article
          className="pop-hover group flex h-full flex-col border-2 border-foreground bg-card shadow-pop [--pop-x:6px] [--pop-y:6px]"
          style={{ "--pop": POP_COLORS[index % POP_COLORS.length] } as React.CSSProperties}
        >
          {/* Meta strip */}
          <div className="flex items-center justify-between border-b-2 border-dotted border-foreground/40 px-4 py-2.5">
            <DifficultyBadge difficulty={quiz.difficulty} />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {quiz._count.questions} Qs
            </span>
          </div>

          <div className="flex flex-1 flex-col p-4 sm:p-5">
            <h3 className="font-sans text-lg font-black uppercase leading-[1.05] tracking-tight sm:text-xl">
              {quiz.title}
            </h3>
            <p className="mt-2 line-clamp-3 font-sans text-sm leading-snug text-muted-foreground">
              {quiz.description}
            </p>

            <div className="mt-auto flex items-center justify-between pt-4">
              <span className="rounded-full border-2 border-foreground px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
                {quiz.category?.name ?? "General"}
              </span>
              <span className="flex h-8 w-8 items-center justify-center border-2 border-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-rotate-45 group-hover:bg-foreground group-hover:text-background">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const chip: Record<Difficulty, string> = {
    easy: "bg-lime-300",
    medium: "bg-amber-300",
    hard: "bg-rose-300"
  };
  return (
    <span className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em]">
      <span aria-hidden className={`inline-block h-2.5 w-2.5 border border-foreground ${chip[difficulty] ?? "bg-foreground"}`} />
      {difficulty}
    </span>
  );
}
