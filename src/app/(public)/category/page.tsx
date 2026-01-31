import Link from "next/link";
import { Sparkles, ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import { Category, getCategories } from "@/queries/categories.query";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "All Quiz Categories - Quizzy",
  description:
    "Explore all quiz categories and test your knowledge across various topics. From science to pop culture, find quizzes that match your interests and challenge yourself."
};

export default async function CategoriesPage() {
  await connection();

  const categories = await getCategories();

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
                <span className="text-indigo-400 font-bold text-lg">{categories.length}</span>
                <span className="text-slate-400 text-sm font-medium">Categories</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-2">
                <span className="text-fuchsia-400 font-bold text-lg">
                  {categories.reduce((acc, c) => acc + c.subCategories.length, 0)}
                </span>
                <span className="text-slate-400 text-sm font-medium">Subcategories</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category List Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 -mt-10">
        <div className="max-w-4xl">
          <div className="space-y-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md dark:hover:shadow-xl dark:hover:shadow-purple-900/10 transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">{cat.name}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{cat._count?.quizzes ?? 0} quizzes</p>
                  </div>
                  <Link
                    href={`/category/${cat.slug}`}
                    prefetch
                    className="text-sm font-medium text-fuchsia-600 dark:text-fuchsia-400 hover:underline"
                  >
                    View all →
                  </Link>
                </div>

                {cat.subCategories?.length ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cat.subCategories.map((sub) => (
                      <Link
                        key={sub.id}
                        prefetch
                        href={`/category/${cat.slug}?sub=${sub.slug}`}
                        className="px-3 py-1 text-sm rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 hover:border-indigo-200 dark:hover:border-indigo-800 transition"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500">No subcategories</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
