import prisma from "@/lib/prisma";
import type { QuizDifficulty } from "@/generated/prisma";

export interface QuizFilters {
  search?: string;
  category?: string;
  difficulty?: QuizDifficulty;
  isPublished?: boolean;
  page?: number;
  limit?: number;
}

export interface AdminQuiz {
  id: string;
  title: string;
  slug: string;
  difficulty: QuizDifficulty;
  isPublished: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  category: { name: string; slug: string } | null;
  subCategory: { name: string; slug: string } | null;
  tags: { name: string }[];
  _count: { questions: number };
}

export interface AdminQuizWithQuestions extends AdminQuiz {
  questions: Array<{
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string | null;
  }>;
}

// Get quizzes with filtering and pagination
export async function getAdminQuizzes(filters: QuizFilters = {}) {
  const {
    search,
    category,
    difficulty,
    isPublished,
    page = 1,
    limit = 10,
  } = filters;

  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) {
    const categoryData = await prisma.category.findUnique({
      where: { slug: category },
      select: { id: true },
    });

    if (categoryData) {
      where.categoryId = categoryData.id;
    }
  }

  if (difficulty) {
    where.difficulty = difficulty;
  }

  if (isPublished !== undefined) {
    where.isPublished = isPublished;
  }

  const [quizzes, total] = await Promise.all([
    prisma.quiz.findMany({
      where,
      include: {
        category: { select: { name: true, slug: true } },
        subCategory: { select: { name: true, slug: true } },
        tags: { include: { tag: { select: { name: true } } } },
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.quiz.count({ where }),
  ]);

  return {
    quizzes: quizzes.map((quiz) => ({
      ...quiz,
      tags: quiz.tags.map((t) => ({ name: t.tag.name })),
    })) as AdminQuiz[],
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
}

// Get single quiz with questions
export async function getAdminQuizById(id: string): Promise<AdminQuizWithQuestions | null> {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      category: { select: { name: true, slug: true } },
      subCategory: { select: { name: true, slug: true } },
      tags: { include: { tag: { select: { name: true } } } },
      questions: {
        orderBy: { createdAt: "asc" },
      },
      _count: { select: { questions: true } },
    },
  });

  if (!quiz) return null;

  return {
    ...quiz,
    tags: quiz.tags.map((t) => ({ name: t.tag.name })),
  } as AdminQuizWithQuestions;
}

// Get dashboard analytics
export async function getDashboardAnalytics() {
  const [
    totalQuizzes,
    publishedQuizzes,
    draftQuizzes,
    totalViews,
    totalCategories,
    totalSubCategories,
    recentQuizzes,
  ] = await Promise.all([
    prisma.quiz.count(),
    prisma.quiz.count({ where: { isPublished: true } }),
    prisma.quiz.count({ where: { isPublished: false } }),
    prisma.quiz.aggregate({ _sum: { views: true } }),
    prisma.category.count(),
    prisma.subCategory.count(),
    prisma.quiz.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true } },
      },
    }),
  ]);

  return {
    totalQuizzes,
    publishedQuizzes,
    draftQuizzes,
    totalViews: totalViews._sum.views || 0,
    totalCategories,
    totalSubCategories,
    recentQuizzes,
  };
}

// Get all categories with subcategory count
export async function getCategoriesWithCounts() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          subCategories: true,
          quizzes: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    subCategoryCount: cat._count.subCategories,
    quizCount: cat._count.quizzes,
  }));
}

// Get all subcategories with category info
export async function getAllSubCategories() {
  return prisma.subCategory.findMany({
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          quizzes: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });
}

// Get all tags
export async function getAllTags() {
  return prisma.tag.findMany({
    include: {
      _count: {
        select: {
          quizzes: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });
}

// Type exports
export type DashboardAnalytics = Awaited<ReturnType<typeof getDashboardAnalytics>>;
export type CategoriesWithCounts = Awaited<ReturnType<typeof getCategoriesWithCounts>>;
export type SubCategoriesWithCategory = Awaited<ReturnType<typeof getAllSubCategories>>;
export type TagsWithCounts = Awaited<ReturnType<typeof getAllTags>>;
