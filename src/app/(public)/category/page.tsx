import Link from "next/link";
import { Sparkles, ChevronLeft, Search } from "lucide-react";
import type { Metadata } from "next";
import { Category, getCategories } from "@/queries/categories.query";
import { connection } from "next/server";
import CategorySearch from "./category-search";
import CategoryCard from "./category-card";

export const metadata: Metadata = {
  title: "All Quiz Categories - Quizzy",
  description:
    "Explore all quiz categories and test your knowledge across various topics. From science to pop culture, find quizzes that match your interests and challenge yourself."
};

const CATEGORIES_PER_PAGE = 12;

export default async function CategoriesPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  await connection();

  const { page = "1", search = "" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page));

  const allCategories = await getCategories();

  // Filter categories based on search
  const filteredCategories = search
    ? allCategories.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        cat.subCategories?.some((sub) =>
          sub.name.toLowerCase().includes(search.toLowerCase())
        )
      )
    : allCategories;

  // Calculate pagination
  const totalCategories = filteredCategories.length;
  const totalPages = Math.max(1, Math.ceil(totalCategories / CATEGORIES_PER_PAGE));
  const validPage = Math.min(currentPage, totalPages);

  // Get paginated categories
  const startIndex = (validPage - 1) * CATEGORIES_PER_PAGE;
  const endIndex = startIndex + CATEGORIES_PER_PAGE;
  const categories = filteredCategories.slice(startIndex, endIndex);

  // Calculate stats
  const totalSubcategories = allCategories.reduce((acc, c) => acc + c.subCategories.length, 0);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 pt-24 pb-12 md:pt-32 md:pb-20">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[70%] h-[70%] rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-50 blur-[120px] animate-pulse" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[70%] h-[70%] rounded-full bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 opacity-30 blur-[120px] animate-pulse [animation-delay:2s]" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6">
          <div className="mb-6 md:mb-8">
            <Link
              href="/"
              prefetch
              className="inline-flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
          </div>

          <div className="max-w-3xl w-full">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white break-words">All Categories</h1>
            </div>

            <p className="text-slate-400 text-base md:text-xl leading-relaxed mb-8 max-w-2xl break-words">
              Explore our diverse collection of quizzes. From science to pop culture, find your perfect challenge and
              test your knowledge.
            </p>

            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-2">
                <span className="text-indigo-400 font-bold text-lg">{allCategories.length}</span>
                <span className="text-slate-400 text-sm font-medium">Categories</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-2">
                <span className="text-fuchsia-400 font-bold text-lg">{totalSubcategories}</span>
                <span className="text-slate-400 text-sm font-medium">Subcategories</span>
              </div>
              {search && (
                <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 backdrop-blur-sm flex items-center gap-2">
                  <span className="text-green-400 font-bold text-lg">{totalCategories}</span>
                  <span className="text-slate-400 text-sm font-medium">Found</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <CategorySearch initialSearch={search} />
      </section>

      {/* Category List Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-4xl">
          {categories.length > 0 ? (
            <>
              <div className="grid gap-6">
                {categories.map((cat) => (
                  <CategoryCard key={cat.id} category={cat} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  {validPage > 1 && (
                    <Link
                      href={`/category?page=${validPage - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                      className="px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      Previous
                    </Link>
                  )}

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (validPage <= 3) {
                        pageNum = i + 1;
                      } else if (validPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = validPage - 2 + i;
                      }

                      const isActive = pageNum === validPage;
                      return (
                        <Link
                          key={pageNum}
                          href={`/category?page=${pageNum}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg transition ${
                            isActive
                              ? "bg-indigo-600 text-white font-bold"
                              : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                  </div>

                  {validPage < totalPages && (
                    <Link
                      href={`/category?page=${validPage + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                      className="px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No categories found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
