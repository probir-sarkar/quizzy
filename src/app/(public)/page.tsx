import SectionHeader from "@/components/common/section-header";
import CategoryFilters from "@/components/home-page/category-filter";
import HeroSection from "@/components/home-page/hero-section";
import QuizListing from "@/components/home-page/quiz-listing";

import { Suspense } from "react";

import TrendingSection from "@/components/home-page/trending-section";
import ToolboxPromoCard from "@/components/common/toolbox-promo-card";
import { api } from "@/lib/eden";

export default async function Home() {
  const [{ data: stats }, { data: homePageData }, { data: categories }] = await Promise.all([
    api.quiz.stats.get({
      fetch: {
        cache: "force-cache",
        next: {
          revalidate: 60 * 60 // 1 hour
        }
      }
    }),
    api.quiz["home-data"].get({
      fetch: {
        cache: "force-cache",
        next: {
          revalidate: 60 * 60 // 1 hour
        }
      }
    }),
    api.quiz.categories.get({
      fetch: {
        cache: "force-cache",
        next: {
          revalidate: 60 * 60 // 1 hour
        }
      }
    })
  ]);

  const data = homePageData ?? [];
  const categoriesList = categories ?? [];
  if (!stats) return null;

  // Extract some trending quizzes (e.g., first quiz from each category)
  const trendingQuizzes = data.flatMap((cat) => cat.quizzes.slice(0, 1)).slice(0, 6);
  if (!stats) return null;

  return (
    <>
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
        <section id={cat.slug} className="container mx-auto pt-16">
          {/* Title */}
          <SectionHeader id={cat.slug} title={cat.name} />
          <QuizListing quizzes={cat.quizzes} />
        </section>
      ))}
    </>
  );
}
