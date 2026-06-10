import { Sparkles, Target, Layers } from "lucide-react";
import { QuizDifficulty } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

import { BreadcrumbItem } from "../common/Breadcrumbs";
import Breadcrumbs from "../common/Breadcrumbs";
import { QuizPageType } from "@/server/modules/quiz/quiz.service";

type QuizPageHeroProps = Omit<QuizPageType, 'createdAt' | 'updatedAt'>;

export default function QuizHero({ quiz, breadcrumbs }: { quiz: QuizPageHeroProps; breadcrumbs: BreadcrumbItem[] }) {
  if (!quiz) return null;

  const difficultyColors = {
    [QuizDifficulty.easy]: "from-emerald-400 to-teal-500",
    [QuizDifficulty.medium]: "from-amber-400 to-orange-500",
    [QuizDifficulty.hard]: "from-rose-400 to-fuchsia-500"
  };

  const iconColors = {
    [QuizDifficulty.easy]: "text-emerald-600 dark:text-emerald-400",
    [QuizDifficulty.medium]: "text-amber-600 dark:text-amber-400",
    [QuizDifficulty.hard]: "text-rose-600 dark:text-rose-400"
  };

  const bgColor = difficultyColors[quiz.difficulty as QuizDifficulty] || "from-violet-400 to-fuchsia-500";
  const iconColor = iconColors[quiz.difficulty as QuizDifficulty] || "text-violet-600 dark:text-violet-400";

  return (
    <div className="relative overflow-hidden bg-linear-to-b from-slate-300 to-gray-50 dark:from-slate-900 dark:to-slate-950 pt-24 md:pt-28 pb-12 md:pb-16 border-b border-gray-200 dark:border-white/5">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={cn("absolute -top-1/2 -right-1/4 w-[70%] h-[70%] rounded-full bg-linear-to-br opacity-10 dark:opacity-20 blur-[120px]", bgColor)} />
        <div className={cn("absolute -bottom-1/2 -left-1/4 w-[70%] h-[70%] rounded-full bg-linear-to-br opacity-5 dark:opacity-10 blur-[120px]", bgColor)} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Left Side */}
          <div className="flex-1 text-center lg:text-left w-full max-w-full">
            <div className="mb-4 flex justify-center lg:justify-start w-full">
              <Breadcrumbs items={breadcrumbs} />
            </div>

            <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md mb-4", "bg-white/40 dark:bg-white/5", "border-gray-200/50 dark:border-white/10")}>
              <span className="text-[10px] font-bold tracking-widest text-gray-700 dark:text-white/80 uppercase">
                {quiz.category?.name || "General"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight wrap-break-word">
              {quiz.title}
            </h1>

            <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400 max-w-2xl mb-5 leading-relaxed wrap-break-word">
              {quiz.description || "Challenge yourself with this expertly curated quiz and see how you rank!"}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              {quiz.tags.map((tag, i) => (
                <span
                  key={tag.tagId}
                  className="px-3 py-1.5 rounded-lg bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-700 dark:text-slate-300 backdrop-blur-sm"
                >
                  #{tag.tag.name}
                </span>
              ))}
            </div>

            {/* Questions & Difficulty Info */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-5">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm">
                <Target className={cn("w-4 h-4", iconColor)} />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {quiz._count.questions} Questions
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm">
                <Layers className={cn("w-4 h-4", iconColor)} />
                <span className={cn("text-sm font-black uppercase tracking-wider text-transparent bg-clip-text bg-linear-to-r bg-white", bgColor)}>
                  {quiz.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
