import CategoryFilters from "@/components/home-page/category-filter";
import HeroSection from "@/components/home-page/hero-section";
import QuizListing from "@/components/home-page/quiz-listing";
import SearchSection from "@/components/home-page/search-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SearchSection />
      <CategoryFilters />
      <QuizListing />
    </>
  );
}
