import CategoryFilters from "@/components/home-page/category-filter";
import HeroSection from "@/components/home-page/hero-section";
import QuizListing from "@/components/home-page/quiz-listing";
import SearchSection from "@/components/home-page/search-section";
import { getHomePageData } from "@/queries/home-page";

export default async function Home() {
  const data = await getHomePageData();
  return (
    <>
      <HeroSection />
      <SearchSection />
      <CategoryFilters data={data} />
      <QuizListing />
    </>
  );
}
