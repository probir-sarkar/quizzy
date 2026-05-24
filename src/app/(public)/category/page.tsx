import Link from "next/link";
import { Sparkles, ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import { client } from "@/lib/orpc";
import { CategoryCard } from "./category-card";

export const metadata: Metadata = {
  title: "All Quiz Categories - Quizzy",
  description:
    "Explore all quiz categories and test your knowledge across various topics. From science to pop culture, find quizzes that match your interests and challenge yourself."
};

export default async function CategoriesPage() {
  const data = await client.getAllCategoriesWithStats();

  const categories = data.categories;
  const totalCategories = data.totalCategories;
  const totalSubcategories = data.totalSubcategories;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-100 dark:bg-slate-950 pt-24 pb-12 md:pt-32 md:pb-20">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[70%] h-[70%] rounded-full bg-linear-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 opacity-50 blur-[120px] animate-pulse" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[70%] h-[70%] rounded-full bg-linear-to-br from-pink-500/10 to-fuchsia-500/10 dark:from-pink-500/20 dark:to-fuchsia-500/20 opacity-30 blur-[120px] animate-pulse [animation-delay:2s]" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6">
          <div className="mb-6 md:mb-8">
            <Link
              href="/"
              prefetch
              className="inline-flex items-center gap-2 rounded-full bg-white/80 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
          </div>

          <div className="max-w-3xl w-full">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white wrap-break-word">
                All Categories
              </h1>
            </div>

            <p className="text-gray-600 dark:text-slate-400 text-base md:text-xl leading-relaxed mb-8 max-w-2xl wrap-break-word">
              Explore our diverse collection of quizzes. From science to pop culture, find your perfect challenge and
              test your knowledge.
            </p>

            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm flex items-center gap-2">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">{totalCategories}</span>
                <span className="text-gray-600 dark:text-slate-400 text-sm font-medium">Categories</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm flex items-center gap-2">
                <span className="text-fuchsia-600 dark:text-fuchsia-400 font-bold text-lg">{totalSubcategories}</span>
                <span className="text-gray-600 dark:text-slate-400 text-sm font-medium">Subcategories</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-6xl">
          {categories.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No categories found</h3>
              <p className="text-gray-500 dark:text-gray-400">Check back later for new content</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
