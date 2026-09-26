import SectionHeader from "@/components/common/section-header";
import CategoryFilters from "@/components/home-page/category-filter";
import HeroSection from "@/components/home-page/hero-section";
import QuizListing from "@/components/home-page/quiz-listing";

import TrendingSection from "@/components/home-page/trending-section";
import BrowserStayPromoCard from "@/components/common/browserstay-promo-card";
import { client } from "@/lib/orpc";

export default async function Home() {
  const { stats, homePageData, categories } = await client.getHomePageData();

  const data = homePageData ?? [];
  const categoriesList = categories ?? [];
  if (!stats) return null;

  // Extract some trending quizzes (e.g., first quiz from each category)
  const trendingQuizzes = data.flatMap((cat) => cat.quizzes.slice(0, 1)).slice(0, 6);

  return (
    <div>
      <h1 className="sr-only">Quizzy - Master Your Knowledge with Thousands of Quizzes</h1>
      <HeroSection
        totalQuizzes={stats.totalQuizzes}
        totalCategories={stats.totalCategories}
        totalSubCategories={stats.totalSubCategories}
      />

      <TrendingSection quizzes={trendingQuizzes} />

      {/* BrowserStay Promotion Section */}
      <div className="mx-auto max-w-[1400px] px-4 pt-16 sm:px-6">
        <BrowserStayPromoCard variant="default" />
      </div>

      <CategoryFilters categories={categoriesList} />
      {data.map((cat) => (
        <section key={cat.slug} id={cat.slug} className="mx-auto max-w-[1400px] px-4 pt-20 sm:px-6">
          {/* Title */}
          <SectionHeader id={cat.slug} title={cat.name} />
          <QuizListing quizzes={cat.quizzes} />
        </section>
      ))}
    </div>
  );
}
