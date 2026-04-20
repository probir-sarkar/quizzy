"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { memo } from "react";
import type { CategoryWithStats } from "@/queries/categories.query";

interface CategoryCardProps {
  category: CategoryWithStats;
}

function CategoryCard({ category }: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Show only first 6 subcategories by default
  const visibleSubCategories = isExpanded
    ? category.subCategories
    : category.subCategories?.slice(0, 6);

  const hasMoreSubCategories = category.subCategories && category.subCategories.length > 6;
  const hasSubCategories = category.subCategories && category.subCategories.length > 0;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md dark:hover:shadow-xl dark:hover:shadow-purple-900/10 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-1">{category.name}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {category._count?.quizzes ?? 0} quizzes
            {hasSubCategories && ` • ${category.subCategories?.length} subcategories`}
          </p>
        </div>
        <Link
          href={`/category/${category.slug}`}
          prefetch
          className="text-sm font-medium text-fuchsia-600 dark:text-fuchsia-400 hover:underline whitespace-nowrap ml-4"
        >
          View all →
        </Link>
      </div>

      {hasSubCategories ? (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {visibleSubCategories?.map((sub) => (
              <Link
                key={sub.id}
                prefetch
                href={`/category/${category.slug}?sub=${sub.slug}`}
                className="px-3 py-1.5 text-sm rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 hover:border-indigo-200 dark:hover:border-indigo-800 transition"
              >
                {sub.name}
                {sub._count?.quizzes > 0 && (
                  <span className="ml-1.5 text-xs text-gray-400">({sub._count.quizzes})</span>
                )}
              </Link>
            ))}
          </div>

          {hasMoreSubCategories && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show {category.subCategories!.length - 6} more subcategories
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500">No subcategories</p>
      )}
    </div>
  );
}

export default memo(CategoryCard, (prev, next) => {
  return prev.category.id === next.category.id;
});
