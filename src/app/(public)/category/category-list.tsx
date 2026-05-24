"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import CategoryCard from "./category-card";
import { calculatePaginationWindow } from "@/lib/pagination-utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { client } from "@/lib/orpc";

const CATEGORIES_PER_PAGE = 12;
const PAGINATION_WINDOW_SIZE = 5;

export function CategoryList() {
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "1");
  const [currentPage, setCurrentPage] = useState(Math.max(1, initialPage));

  const { data, isLoading, error } = useQuery({
    queryKey: ["categories-with-stats", currentPage],
    queryFn: async () => {
      return await client.getCategoriesWithStats({
        page: currentPage,
        perPage: CATEGORIES_PER_PAGE
      });
    },
    staleTime: 60 * 60 * 1000 // 1 hour
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-4xl space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-4xl text-center py-20">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Failed to load categories</h3>
          <p className="text-gray-500 dark:text-gray-400">Please try again later</p>
        </div>
      </div>
    );
  }

  const categories = data?.items ?? [];
  const meta = data?.meta ?? {
    totalCategories: 0,
    totalSubcategories: 0,
    totalPages: 1,
    currentPage: 1,
    perPage: CATEGORIES_PER_PAGE
  };

  const { totalPages } = meta;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
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
              <div className="mt-12 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                        >
                          Previous
                        </button>
                      </PaginationItem>
                    )}

                    {calculatePaginationWindow(currentPage, totalPages, PAGINATION_WINDOW_SIZE).pages.map(
                      (pageNum: number) => {
                        const isActive = pageNum === currentPage;
                        return (
                          <PaginationItem key={pageNum}>
                            <button
                              onClick={() => handlePageChange(pageNum)}
                              className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 ${
                                isActive
                                  ? "bg-primary text-primary-foreground shadow hover:bg-primary/90"
                                  : "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
                              }`}
                            >
                              {pageNum}
                            </button>
                          </PaginationItem>
                        );
                      }
                    )}

                    {(() => {
                      const { showEndEllipsis } = calculatePaginationWindow(
                        currentPage,
                        totalPages,
                        PAGINATION_WINDOW_SIZE
                      );
                      return showEndEllipsis ? (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : null;
                    })()}

                    {currentPage < totalPages && (
                      <PaginationItem>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                        >
                          Next
                        </button>
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No categories found</h3>
            <p className="text-gray-500 dark:text-gray-400">Check back later for new content</p>
          </div>
        )}
      </div>
    </section>
  );
}
