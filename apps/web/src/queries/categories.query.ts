// lib/queries/categories.ts
import { QuizWhereInput } from "@quizzy/prisma/models";
import prisma from "@/lib/prisma";

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
  const skip = (page - 1) * perPage;

  // Build where clause
  const where: QuizWhereInput = {
    category: { slug: categorySlug }
  };

  if (subCategorySlug) {
    where.subCategory = { slug: subCategorySlug };
  }

  // Fetch category and its subCategories (if any)
  const category = await prisma.category.findUnique({
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
  });

  // total count for pagination meta
  const total = await prisma.quiz.count({ where });

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
