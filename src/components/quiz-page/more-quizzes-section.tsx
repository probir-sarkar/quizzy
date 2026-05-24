"use client";

import { useQuery } from "@tanstack/react-query";
import { QuizCard } from "@/components/home-page/quiz-card";
import { Sparkles } from "lucide-react";
import { client } from "@/lib/orpc";

type MoreQuizzesSectionProps = {
  slug: string;
};

export function MoreQuizzesSection({ slug }: MoreQuizzesSectionProps) {
  const { data: moreQuizzes, isLoading } = useQuery({
    queryKey: ["more-quizzes", slug],
    queryFn: async () => {
      return await client.getMoreQuizzes({ slug });
    },
    enabled: !!slug
  });

  if (isLoading) {
    return (
      <div className="mt-12 md:mt-24 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-slate-900 py-10 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6 md:mb-10">
            <div className="p-2 rounded-xl bg-violet-600/10 border border-violet-600/20">
              <Sparkles className="w-5 h-5 text-violet-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              Related Quizzes
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!moreQuizzes || moreQuizzes.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 md:mt-24 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-slate-900 py-10 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6 md:mb-10">
          <div className="p-2 rounded-xl bg-violet-600/10 border border-violet-600/20">
            <Sparkles className="w-5 h-5 text-violet-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            Related Quizzes
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {moreQuizzes.map((q, i) => (
            <QuizCard key={q.id} index={i} quiz={q} />
          ))}
        </div>
      </div>
    </div>
  );
}
