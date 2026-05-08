import prisma from "@/lib/prisma";
import { QuizWhereInput } from "@/generated/prisma/models";
import { shuffle } from "es-toolkit/array";

export type HomePageData = Awaited<ReturnType<typeof QuizService.getHomePageData>>;
export type QuizCard = HomePageData[number]["quizzes"][number];

// quiz page type without null
export type QuizPageType = NonNullable<Awaited<ReturnType<typeof QuizService.getQuiz>>>;

// question type helper
export type QuestionType = QuizPageType["questions"][number];

export type CategoriesWithStatsData = Awaited<
  ReturnType<typeof QuizService.getCategoriesWithStats>
>;
export type CategoryWithStats = CategoriesWithStatsData["items"][number];

export type GetQuizzesByCategoryOpts = {
  categorySlug: string;
  page?: number;
  perPage?: number;
  subCategorySlug?: string | null;
};

export const DEFAULT_PER_PAGE = 12;
export function shuffleOptions(question: QuestionType): QuestionType {
  const optionsWithIndex = question.options.map((text, index) => ({
    text,
    index,
  }));

  const shuffled = shuffle(optionsWithIndex);

  return {
    ...question,
    options: shuffled.map((o) => o.text),
    correctIndex: shuffled.findIndex((o) => o.index === question.correctIndex),
  };
}

export abstract class QuizService {
  static async getHomePageStats() {
    const [totalQuizzes, totalCategories, totalSubCategories] = await Promise.all([
      prisma.quiz.count(),
      prisma.category.count(),
      prisma.subCategory.count(),
    ]);

    return {
      totalQuizzes,
      totalCategories,
      totalSubCategories,
    };
  }

  static async getHomePageData() {
    return prisma.category.findMany({
      where: {
        quizzes: {
          some: {},
        },
      },
      take: 12,
      include: {
        quizzes: {
          take: 4,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            category: true,
            _count: {
              select: {
                questions: true,
              },
            },
          },
        },
      },
    });
  }

  static async getCategories() {
    return prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  static async getCategoryInfo(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        subCategories: {
          include: {
            _count: {
              select: {
                quizzes: true,
              },
            },
          },
          orderBy: {
            quizzes: {
              _count: "desc",
            },
          },
        },
        _count: {
          select: {
            quizzes: true,
          },
        },
      },
    });
  }

  static async getQuizzesByCategory({
    categorySlug,
    page = 1,
    perPage = DEFAULT_PER_PAGE,
    subCategorySlug = null,
  }: GetQuizzesByCategoryOpts) {
    const actualPage = page ?? 1;
    const actualPerPage = perPage ?? DEFAULT_PER_PAGE;
    const skip = (actualPage - 1) * actualPerPage;

    const where: QuizWhereInput = {
      category: { slug: categorySlug },
    };

    if (subCategorySlug) {
      where.subCategory = { slug: subCategorySlug };
    }

    const [category, total] = await Promise.all([
      prisma.category.findUnique({
        where: { slug: categorySlug },
        include: {
          subCategories: {
            include: {
              _count: {
                select: {
                  quizzes: true,
                },
              },
            },
            orderBy: {
              quizzes: {
                _count: "desc",
              },
            },
          },
          _count: {
            select: {
              quizzes: true,
            },
          },
        },
      }),
      prisma.quiz.count({ where }),
    ]);

    const items = await prisma.quiz.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: actualPerPage,
      include: {
        category: true,
        subCategory: true,
        tags: { include: { tag: true } },
        _count: { select: { questions: true } },
      },
    });

    const totalPages = Math.max(1, Math.ceil(total / actualPerPage));

    return {
      items,
      category,
      meta: {
        total,
        totalPages,
        currentPage: actualPage,
        perPage: actualPerPage,
      },
    };
  }

  static async getCategoriesStats() {
    const [totalCategories, totalSubcategories] = await Promise.all([
      prisma.category.count(),
      prisma.subCategory.count(),
    ]);

    return {
      totalCategories,
      totalSubcategories,
    };
  }

  static async getCategoriesWithStats({ page = 1, perPage = 12 } = {}) {
    const actualPage = page ?? 1;
    const actualPerPage = perPage ?? 12;
    const skip = (actualPage - 1) * actualPerPage;

    const [items, totalCategories, totalSubcategories] = await Promise.all([
      prisma.category.findMany({
        skip,
        take: actualPerPage,
        include: {
          subCategories: {
            include: {
              _count: {
                select: {
                  quizzes: true,
                },
              },
            },
            orderBy: {
              quizzes: {
                _count: "desc",
              },
            },
          },
          _count: { select: { quizzes: true, subCategories: true } },
        },
      }),
      prisma.category.count(),
      prisma.subCategory.count(),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCategories / actualPerPage));

    return {
      items,
      meta: {
        totalCategories,
        totalSubcategories,
        totalPages,
        currentPage: actualPage,
        perPage: actualPerPage,
      },
    };
  }

  static async getQuiz(slug: string) {
    const quiz = await prisma.quiz.findUnique({
      where: { slug },
      include: {
        category: true,
        questions: true,
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });

    return quiz;
  }

  static async getMoreQuizzes(currentSlug: string) {
    return prisma.quiz.findMany({
      where: { slug: { not: currentSlug } },
      take: 6,
      orderBy: { publishedAt: "desc" },
      include: {
        category: true,
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });
  }

  static async getQuizForMetadata(slug: string) {
    return prisma.quiz.findUnique({
      where: { slug },
      select: {
        title: true,
        description: true,
        quizPageTitle: true,
        quizPageDescription: true,
        category: {
          select: {
            name: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
