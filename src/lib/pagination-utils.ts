/**
 * Pagination utility functions for consistent pagination across the app
 */

export interface PaginationWindow {
  pages: number[];
  showStartEllipsis: boolean;
  showEndEllipsis: boolean;
}

/**
 * Calculate pagination window with ellipsis for large page counts
 * @param currentPage - Current active page (1-indexed)
 * @param totalPages - Total number of pages
 * @param windowSize - Maximum number of page buttons to show (default: 5)
 */
export function calculatePaginationWindow(
  currentPage: number,
  totalPages: number,
  windowSize: number = 5
): PaginationWindow {
  const pages: number[] = [];
  let showStartEllipsis = false;
  let showEndEllipsis = false;

  if (totalPages <= windowSize) {
    // Show all pages if total fits in window
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else if (currentPage <= 3) {
    // Show first window pages when current page is near start
    for (let i = 1; i <= windowSize; i++) {
      pages.push(i);
    }
    showEndEllipsis = true;
  } else if (currentPage >= totalPages - 2) {
    // Show last window pages when current page is near end
    showStartEllipsis = true;
    for (let i = totalPages - windowSize + 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Show window around current page
    showStartEllipsis = true;
    showEndEllipsis = true;
    const startPage = currentPage - Math.floor(windowSize / 2);
    const endPage = currentPage + Math.floor(windowSize / 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  }

  return {
    pages,
    showStartEllipsis,
    showEndEllipsis
  };
}

/**
 * Calculate pagination metadata
 */
export function calculatePaginationMetadata(
  totalItems: number,
  currentPage: number,
  perPage: number
) {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const validPage = Math.max(1, Math.min(currentPage, totalPages));

  return {
    totalPages,
    validPage,
    hasNextPage: validPage < totalPages,
    hasPrevPage: validPage > 1,
    startIndex: (validPage - 1) * perPage,
    endIndex: Math.min(validPage * perPage, totalItems)
  };
}
