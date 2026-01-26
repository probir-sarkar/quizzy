import SectionHeader from "@/components/common/section-header";
import CategoryFilters from "@/components/home-page/category-filter";
import HeroSection from "@/components/home-page/hero-section";
import QuizListing from "@/components/home-page/quiz-listing";

import { getCategories, getHomePageData, HomePageData } from "@/queries/home-page";
import { getStats, Stats } from "@/queries/stats";
import { cacheLife } from "next/cache";
import { connection } from "next/server";

import TrendingSection from "@/components/home-page/trending-section";

export default async function Home() {
  await connection();
  const [data, stats, categories] = await Promise.all([getHomePageData(), getStats(), getCategories()]);

  // Extract some trending quizzes (e.g., first quiz from each category)
  const trendingQuizzes = data.flatMap((cat) => cat.quizzes.slice(0, 1)).slice(0, 6);

  return (
    <>
      <HeroSection
        totalQuizzes={stats.totalQuizzes}
        totalCategories={stats.totalCategories}
        totalSubCategories={stats.totalSubCategories}
      />
      <TrendingSection quizzes={trendingQuizzes} />
      <CategoryFilters categories={categories} />
      {data.map((cat) => (
        <section key={cat.slug} id={cat.slug} className="container mx-auto pt-16">
          {/* Title */}
          <SectionHeader id={cat.slug} title={cat.name} />
          <QuizListing key={cat.slug} quizzes={cat.quizzes} />
        </section>
      ))}
    </>
  );
}
