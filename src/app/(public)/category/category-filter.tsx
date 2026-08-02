"use client";

import { Search, ArrowUpDown } from "lucide-react";
import { useState, useMemo } from "react";
import { CategoryCard } from "./category-card";

interface Category {
  id: number;
  name: string;
  slug: string;
  _count: {
    quizzes: number;
    subCategories: number;
  } | null;
}

interface CategoryFilterProps {
  categories: Category[];
}

type SortOption = "name-asc" | "name-desc" | "quizzes-desc" | "quizzes-asc";

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filteredCategories = useMemo(() => {
    let result = [...categories];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((cat) => cat.name.toLowerCase().includes(query));
    }

    // Sort
    result.sort((a, b) => {
      const aQuizCount = a._count?.quizzes ?? 0;
      const bQuizCount = b._count?.quizzes ?? 0;

      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "quizzes-desc":
          return bQuizCount - aQuizCount;
        case "quizzes-asc":
          return aQuizCount - bQuizCount;
        default:
          return 0;
      }
    });

    return result;
  }, [categories, searchQuery, sortBy]);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "quizzes-desc", label: "Most Quizzes" },
    { value: "quizzes-asc", label: "Least Quizzes" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all text-sm sm:text-base"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative sm:w-auto">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-sm"
          >
            <ArrowUpDown className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium truncate">
              {sortOptions.find((opt) => opt.value === sortBy)?.label}
            </span>
          </button>

          {isSortOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsSortOpen(false)}
              />
              <div className="absolute right-0 left-0 sm:left-auto sm:min-w-48 mt-2 z-20 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      sortBy === option.value
                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Results count */}
      {searchQuery && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"} found
        </p>
      )}

      {/* Render filtered categories */}
      {filteredCategories.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No categories found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
