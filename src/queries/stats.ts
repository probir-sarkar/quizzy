import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export async function getStats() {
  return unstable_cache(
    async () => {
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
    },
    ["site-stats"],
    {
      revalidate: 3600,
      tags: ["site-stats"]
    }
  )();
}

export type Stats = Awaited<ReturnType<typeof getStats>>;
