"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QuizCard } from "@/components/home-page/quiz-card";
import SubCategoryFilters from "@/components/category/sub-category-filter";
import { calculatePaginationWindow } from "@/lib/pagination-utils";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "@/components/ui/pagination";
import { client } from "@/lib/orpc";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

const QUIZZES_PER_PAGE = 12;
const PAGINATION_WINDOW_SIZE = 5;

type QuizListProps = {
  categorySlug: string;
};

export function QuizList({ categorySlug }: QuizListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  // Fetch subCategories separately
  const { data: subCategories = [] } = useQuery({
    queryKey: ["subcategories-by-category", categorySlug],
    queryFn: async () => {
      return await client.getSubCategoriesByCategory({ slug: categorySlug });
    },
    staleTime: 60 * 60 * 1000 // 1 hour
  });

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
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-56 animate-pulse border-2 border-foreground/30" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
        <div className="border-2 border-dashed border-foreground/40 py-20 text-center">
          <h3 className="font-sans text-2xl font-black uppercase tracking-tight">Failed to load quizzes</h3>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SubCategoryFilters
        subCategories={subCategories.map((sc) => ({
          name: sc.name,
          slug: sc.slug,
          count: sc._count?.quizzes ?? 0
        }))}
        selectedSlug={selectedSubcategory}
        onSelect={handleSubcategoryChange}
      />
      <div id="quizzes" className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
        {quizzes.length > 0 ? (
          <>
            <Stagger gap={0.03} className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {quizzes.map((q, i) => (
                <StaggerItem key={q.id} className="h-full">
                  <QuizCard quiz={q} index={i} />
                </StaggerItem>
              ))}
            </Stagger>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          className="cursor-pointer border-2 border-foreground bg-background px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] transition-colors hover:bg-foreground hover:text-background"
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
                              aria-current={isActive ? "page" : undefined}
                              className={`h-10 w-10 cursor-pointer border-2 font-mono text-sm font-bold tabular-nums transition-all ${
                                isActive
                                  ? "border-foreground bg-foreground text-background shadow-pop [--pop:var(--pop-lime)] [--pop-x:3px] [--pop-y:3px]"
                                  : "border-foreground bg-background hover:bg-foreground hover:text-background"
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
                          className="cursor-pointer border-2 border-foreground bg-background px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] transition-colors hover:bg-foreground hover:text-background"
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
          <div className="border-2 border-dashed border-foreground/40 py-20 text-center">
            <h3 className="font-sans text-2xl font-black uppercase tracking-tight">No quizzes found</h3>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Try selecting a different sub-topic
            </p>
          </div>
        )}
      </div>
    </>
  );
}
