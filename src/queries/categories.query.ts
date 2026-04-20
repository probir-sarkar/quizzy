// lib/queries/categories.ts
import { QuizWhereInput } from "@/generated/prisma/models";
import prisma from "@/lib/prisma";
import { cacheLife } from "next/cache";

export type GetQuizzesByCategoryOpts = {
  categorySlug: string;
  page?: number;
  perPage?: number;
  subCategorySlug?: string | null;
};

export const DEFAULT_PER_PAGE = 12;

/**
 * Get quizzes for a category (optionally constrained to a sub-category) with pagination.
 */
export async function getQuizzesByCategory({
  categorySlug,
  page = 1,
  perPage = DEFAULT_PER_PAGE,
  subCategorySlug = null
}: GetQuizzesByCategoryOpts) {
  "use cache";
  cacheLife("minutes");

  const skip = (page - 1) * perPage;

  // Build where clause
  const where: QuizWhereInput = {
    category: { slug: categorySlug }
  };

  if (subCategorySlug) {
    where.subCategory = { slug: subCategorySlug };
  }

  // Batch category lookup and count queries for better performance
  const [category, total] = await Promise.all([
    prisma.category.findUnique({
      where: { slug: categorySlug },
      include: {
        subCategories: {
          include: {
            _count: {
              select: {
                quizzes: true
              }
            }
          }
        },
        _count: {
          select: {
            quizzes: true
          }
        }
      }
    }),
    prisma.quiz.count({ where })
  ]);

  // fetch page of quizzes
  const items = await prisma.quiz.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: perPage,
    include: {
      category: true,
      subCategory: true,
      tags: { include: { tag: true } },
      _count: { select: { questions: true } }
    }
  });

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return {
    items,
    category,
    meta: {
      total,
      totalPages,
      currentPage: page,
      perPage
    }
  };
}

export type QuizByCategory = Awaited<ReturnType<typeof getQuizzesByCategory>>["items"][number];

export type GetCategoriesOpts = {
  page?: number;
  perPage?: number;
};

/**
 * Get categories with pagination at the database level.
 */
export async function getCategories({
  page = 1,
  perPage = 12
}: GetCategoriesOpts = {}) {
  "use cache";
  cacheLife("hours");

  const skip = (page - 1) * perPage;

  // Fetch paginated categories and total count in parallel
  const [items, total] = await Promise.all([
    prisma.category.findMany({
      skip,
      take: perPage,
      include: {
        subCategories: true,
        _count: { select: { quizzes: true, subCategories: true } }
      }
    }),
    prisma.category.count()
  ]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return {
    items,
    meta: {
      total,
      totalPages,
      currentPage: page,
      perPage
    }
  };
}

export type Category = Awaited<ReturnType<typeof getCategories>>["items"][number];
export type CategoryWithStats = Awaited<ReturnType<typeof getCategoriesWithStats>>["items"][number];

/**
 * Get total count of all subcategories across all categories.
 */
export async function getTotalSubcategoryCount(): Promise<number> {
  "use cache";
  cacheLife("hours");

  return prisma.subCategory.count();
}

/**
 * Get categories with pagination and total subcategory count in a single query.
 */
export async function getCategoriesWithStats({
  page = 1,
  perPage = 12
}: GetCategoriesOpts = {}) {
  "use cache";
  cacheLife("hours");

  const skip = (page - 1) * perPage;

  // Fetch paginated categories, total categories, and total subcategories in parallel
  const [items, totalCategories, totalSubcategories] = await Promise.all([
    prisma.category.findMany({
      skip,
      take: perPage,
      include: {
        subCategories: {
          include: {
            _count: {
              select: {
                quizzes: true
              }
            }
          }
        },
        _count: { select: { quizzes: true, subCategories: true } }
      }
    }),
    prisma.category.count(),
    prisma.subCategory.count()
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCategories / perPage));

  return {
    items,
    meta: {
      totalCategories,
      totalSubcategories,
      totalPages,
      currentPage: page,
      perPage
    }
  };
}
