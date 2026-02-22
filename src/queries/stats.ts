import prisma from "@/lib/prisma";
import { cacheLife } from "next/cache";

export async function getStats() {
  "use cache";
  cacheLife("hours");

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

export type Stats = Awaited<ReturnType<typeof getStats>>;
