import SectionHeader from "@/components/common/section-header";
import CategoryFilters from "@/components/home-page/category-filter";
import HeroSection from "@/components/home-page/hero-section";
import QuizListing from "@/components/home-page/quiz-listing";
import SearchSection from "@/components/home-page/search-section";
import { getHomePageData } from "@/queries/home-page";
import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

const homePage = unstable_cache(
  async () => {
    return getHomePageData();
  },
  ['home-page'],
  {
    revalidate: 3600
  }
);
export default async function Home() {
  const data = await homePage();

  return (
    <>
      <HeroSection />
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
