import SectionHeader from "@/components/common/section-header";
import CategoryFilters from "@/components/home-page/category-filter";
import HeroSection from "@/components/home-page/hero-section";
import QuizListing from "@/components/home-page/quiz-listing";

import { getCategories, getHomePageData } from "@/queries/home-page";
import { connection } from "next/server";
import { Suspense } from "react";

import TrendingSection from "@/components/home-page/trending-section";
import ToolboxPromoCard from "@/components/common/toolbox-promo-card";
import { api } from "@/lib/eden";

export default async function Home() {
  await connection();
  const [data, categories] = await Promise.all([getHomePageData(), getCategories()]);
  const { data: stats } = await api.quiz.stats.get({
    fetch: {
      cache: "force-cache",
      next: {
        revalidate: 60 * 60 // 1 hour
      }
    }
  });

  // Extract some trending quizzes (e.g., first quiz from each category)
  const trendingQuizzes = data.flatMap((cat) => cat.quizzes.slice(0, 1)).slice(0, 6);
  if (!stats) return null;

  return (
    <>
      <Suspense fallback={<div className="h-96 animate-pulse bg-slate-100 dark:bg-slate-900" />}>
        <HeroSection
          totalQuizzes={stats.totalQuizzes}
          totalCategories={stats.totalCategories}
          totalSubCategories={stats.totalSubCategories}
        />
      </Suspense>
      <Suspense fallback={<div className="h-64 animate-pulse bg-slate-100 dark:bg-slate-900" />}>
        <TrendingSection quizzes={trendingQuizzes} />
      </Suspense>

      {/* Toolbox Promotion Section */}
      <div className="container mx-auto px-4 py-12">
        <ToolboxPromoCard variant="default" />
      </div>

      <Suspense fallback={<div className="h-32 animate-pulse bg-slate-100 dark:bg-slate-900" />}>
        <CategoryFilters categories={categories} />
      </Suspense>
      {data.map((cat) => (
        <Suspense
          key={cat.slug}
          fallback={<div className="container mx-auto pt-16 h-64 animate-pulse bg-slate-100 dark:bg-slate-900" />}
        >
          <section id={cat.slug} className="container mx-auto pt-16">
            {/* Title */}
            <SectionHeader id={cat.slug} title={cat.name} />
            <QuizListing quizzes={cat.quizzes} />
          </section>
        </Suspense>
      ))}
    </>
  );
}
