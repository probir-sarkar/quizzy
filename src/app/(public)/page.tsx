import SectionHeader from "@/components/common/section-header";
import CategoryFilters from "@/components/home-page/category-filter";
import HeroSection from "@/components/home-page/hero-section";
import QuizListing from "@/components/home-page/quiz-listing";

import { HomePageData } from "@/queries/home-page";
import { Stats } from "@/queries/stats";

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/home`);
  const { data, stats }: { data: HomePageData; stats: Stats } = await res.json();

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
