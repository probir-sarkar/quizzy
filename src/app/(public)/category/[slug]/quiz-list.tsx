"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { QuizCard } from "@/components/home-page/quiz-card";
import SubCategoryFilters from "@/components/category/sub-category-filter";
import { calculatePaginationWindow } from "@/lib/pagination-utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { client } from "@/lib/orpc";

const QUIZZES_PER_PAGE = 12;
const PAGINATION_WINDOW_SIZE = 5;

type QuizListProps = {
  categorySlug: string;
};

export function QuizList({ categorySlug }: QuizListProps) {
  const searchParams = useSearchParams();

  const pageParam = searchParams.get("page");
  const subcategoryParam = searchParams.get("subcategory");

  const [currentPage, setCurrentPage] = useState(Math.max(1, Number(pageParam) || 1));
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(subcategoryParam);

  const { data, isLoading, error } = useQuery({
    queryKey: ["quizzes-by-category", categorySlug, currentPage, selectedSubcategory],
    queryFn: async () => {
      return await client.getQuizzesByCategory({
        categorySlug,
        page: currentPage,
        perPage: QUIZZES_PER_PAGE,
        subCategorySlug: selectedSubcategory ?? undefined
      });
    },
    staleTime: 60 * 60 * 1000 // 1 hour
  });

  const quizzes = data?.items ?? [];
  const meta = data?.meta ?? {
    total: 0,
    totalPages: 1,
    currentPage: 1,
    perPage: QUIZZES_PER_PAGE
  };
  const subCategories = data?.category?.subCategories ?? [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubcategoryChange = (subcategorySlug: string | null) => {
    setSelectedSubcategory(subcategorySlug);
    setCurrentPage(1); // Reset to first page when changing subcategory
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-10">
        <div className="px-4 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 container mx-auto">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-10">
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Failed to load quizzes</h3>
          <p className="text-gray-500 dark:text-gray-400">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="">
        <SubCategoryFilters
          subCategories={subCategories.map((sc) => ({
            name: sc.name,
            slug: sc.slug,
            count: sc._count?.quizzes ?? 0
          }))}
          selectedSlug={selectedSubcategory}
          onSelect={handleSubcategoryChange}
        />
      </div>
      <div id="quizzes" className="container mx-auto px-6 py-10">
        {quizzes.length > 0 ? (
          <>
            <div className="px-4 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 container mx-auto">
              {quizzes.map((q, i) => (
                <QuizCard key={q.id} index={i} quiz={q} />
              ))}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="mt-10 flex justify-center">
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

                    {calculatePaginationWindow(currentPage, meta.totalPages, PAGINATION_WINDOW_SIZE).pages.map(
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
                        meta.totalPages,
                        PAGINATION_WINDOW_SIZE
                      );
                      return showEndEllipsis ? (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : null;
                    })()}

                    {currentPage < meta.totalPages && (
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
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No quizzes found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try selecting a different subcategory</p>
          </div>
        )}
      </div>
    </>
  );
}
