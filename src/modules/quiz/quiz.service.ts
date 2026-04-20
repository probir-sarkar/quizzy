import prisma from "@/lib/prisma";
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
}
