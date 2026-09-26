"use client";

import { useQuery } from "@tanstack/react-query";
import { QuizCard } from "@/components/home-page/quiz-card";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
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
      <div className="mt-20 border-t-2 border-foreground px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 h-10 w-64 animate-pulse border-2 border-foreground/30" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 animate-pulse border-2 border-foreground/30" />
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
    <div className="mt-20 border-t-2 border-foreground px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
              Don&apos;t stop now
            </p>
            <h2 className="font-sans text-4xl font-black uppercase tracking-tight sm:text-6xl">Keep Going</h2>
          </div>
        </div>
        <Stagger gap={0.05} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {moreQuizzes.map((q, i) => (
            <StaggerItem key={q.id} className="h-full">
              <QuizCard quiz={q} index={i} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}
