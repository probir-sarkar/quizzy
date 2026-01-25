import SectionHeader from "@/components/common/section-header";
import CategoryFilters from "@/components/home-page/category-filter";
import HeroSection from "@/components/home-page/hero-section";
import QuizListing from "@/components/home-page/quiz-listing";

import { getHomePageData, HomePageData } from "@/queries/home-page";
import { getStats, Stats } from "@/queries/stats";
import { cacheLife } from "next/cache";
import { connection } from "next/server";

export default async function Home() {
  await connection();
  const [data, stats] = await Promise.all([getHomePageData(), getStats()]);

  return (
    <>
      <HeroSection
        totalQuizzes={stats.totalQuizzes}
        totalCategories={stats.totalCategories}
        totalSubCategories={stats.totalSubCategories}
      />
      {/* <SearchSection /> */}
      <CategoryFilters />
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
