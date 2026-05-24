import SectionHeader from "@/components/common/section-header";
import CategoryFilters from "@/components/home-page/category-filter";
import HeroSection from "@/components/home-page/hero-section";
import QuizListing from "@/components/home-page/quiz-listing";

import TrendingSection from "@/components/home-page/trending-section";
import ToolboxPromoCard from "@/components/common/toolbox-promo-card";
import { client } from "@/lib/orpc";

export default async function Home() {
  const [stats, homePageData, categories] = await Promise.all([
    client.getQuizStats(),
    client.getQuizHomeData(),
    client.getQuizCategories()
  ]);

  const data = homePageData ?? [];
  const categoriesList = categories ?? [];
  if (!stats) return null;

  // Extract some trending quizzes (e.g., first quiz from each category)
  const trendingQuizzes = data.flatMap((cat) => cat.quizzes.slice(0, 1)).slice(0, 6);
  if (!stats) return null;

  return (
    <div>
      <h1 className="sr-only">Quizzy - Master Your Knowledge with Thousands of Quizzes</h1>
      <HeroSection
        totalQuizzes={stats.totalQuizzes}
        totalCategories={stats.totalCategories}
        totalSubCategories={stats.totalSubCategories}
      />

      <TrendingSection quizzes={trendingQuizzes} />

      {/* Toolbox Promotion Section */}
      <div className="container mx-auto px-4 py-12">
        <ToolboxPromoCard variant="default" />
      </div>

      <CategoryFilters categories={categoriesList} />
      {data.map((cat) => (
        <section key={cat.slug} id={cat.slug} className="container mx-auto pt-16">
          {/* Title */}
          <SectionHeader id={cat.slug} title={cat.name} />
          <QuizListing quizzes={cat.quizzes} />
        </section>
      ))}
    </div>
  );
}
