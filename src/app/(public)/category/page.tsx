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
      <section className="relative bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/20 dark:from-black/30 dark:to-black/40" />
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 dark:bg-white/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white/5 dark:bg-white/3 blur-3xl" />

        <div className="relative container mx-auto px-6 py-20">
          <div className="mb-6">
            <Link
              href="/"
              prefetch
              className="inline-flex items-center gap-2 rounded-full bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 backdrop-blur-sm px-3 py-1.5 text-sm font-medium transition"
            >
              <ChevronLeft className="w-4 h-4" /> Home
            </Link>
          </div>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-6 h-6 opacity-95" />
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">All Categories</h1>
            </div>

            <p className="text-white/90 dark:text-white/80 text-base md:text-lg leading-relaxed mb-6 max-w-2xl">
              Explore all quiz categories and their subcategories. Choose a topic and test your knowledge!
            </p>

            <div className="flex flex-wrap gap-4">
              <span className="px-4 py-1.5 bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 rounded-full text-sm font-medium">
                {categories.length} Categories
              </span>
              <span className="px-4 py-1.5 bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 rounded-full text-sm font-medium">
                {categories.reduce((acc, c) => acc + c.subCategories.length, 0)} Subcategories
              </span>
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
