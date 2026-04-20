import prisma from "@/lib/prisma";

export type HomePageData = Awaited<ReturnType<typeof QuizService.getHomePageData>>;
export type QuizCard = HomePageData[number]["quizzes"][number];

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
}
