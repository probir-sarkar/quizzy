import prisma from "@/lib/prisma";
import { QuizWhereInput } from "@/generated/prisma/models";

export type HomePageData = Awaited<ReturnType<typeof QuizService.getHomePageData>>;
export type QuizCard = HomePageData[number]["quizzes"][number];

export type GetQuizzesByCategoryOpts = {
  categorySlug: string;
  page?: number;
  perPage?: number;
  subCategorySlug?: string | null;
};

export const DEFAULT_PER_PAGE = 12;

export abstract class QuizService {
  static async getHomePageStats() {
    const [totalQuizzes, totalCategories, totalSubCategories] = await Promise.all([
      prisma.quiz.count(),
      prisma.category.count(),
      prisma.subCategory.count()
    ]);

    return {
      totalQuizzes,
      totalCategories,
      totalSubCategories
    };
  }

  static async getHomePageData() {
    return prisma.category.findMany({
      where: {
        quizzes: {
          some: {}
        }
      },
      take: 12,
      include: {
        quizzes: {
          take: 4,
          orderBy: {
            createdAt: "desc"
          },
          include: {
            category: true,
            _count: {
              select: {
                questions: true
              }
            }
          }
        }
      }
    });
  }

  static async getCategories() {
    return prisma.category.findMany({
      orderBy: {
        name: "asc"
      }
    });
  }

  static async getQuizzesByCategory({
    categorySlug,
    page = 1,
    perPage = DEFAULT_PER_PAGE,
    subCategorySlug = null
  }: GetQuizzesByCategoryOpts) {
    const actualPage = page ?? 1;
    const actualPerPage = perPage ?? DEFAULT_PER_PAGE;
    const skip = (actualPage - 1) * actualPerPage;

    const where: QuizWhereInput = {
      category: { slug: categorySlug }
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

    const items = await prisma.quiz.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: actualPerPage,
      include: {
        category: true,
        subCategory: true,
        tags: { include: { tag: true } },
        _count: { select: { questions: true } }
      }
    });

    const totalPages = Math.max(1, Math.ceil(total / actualPerPage));

    return {
      items,
      category,
      meta: {
        total,
        totalPages,
        currentPage: actualPage,
        perPage: actualPerPage
      }
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
          subCategories: true,
          _count: { select: { quizzes: true, subCategories: true } }
        }
      }),
      prisma.category.count(),
      prisma.subCategory.count()
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCategories / actualPerPage));

    return {
      items,
      meta: {
        totalCategories,
        totalSubcategories,
        totalPages,
        currentPage: actualPage,
        perPage: actualPerPage
      }
    };
  }

  static async getQuiz(slug: string) {
    return prisma.quiz.findUnique({
      where: { slug },
      include: {
        category: true,
        questions: true,
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            questions: true
          }
        }
      }
    });
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
            questions: true
          }
        }
      }
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
            name: true
          }
        },
        tags: {
          select: {
            tag: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
  }
}
