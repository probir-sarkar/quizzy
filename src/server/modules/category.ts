import { os } from "@orpc/server";
import prisma from "@/lib/prisma";
import { cacheMiddleware, ONE_DAY } from "../middleware/cache.middleware";

export const getAllCategoriesWithStats = os.use(cacheMiddleware({ ttl: ONE_DAY })).handler(async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { quizzes: true, subCategories: true }
      }
    },
    orderBy: { name: "asc" }
  });

  return {
    categories
  };
});

export const getCategoryCounts = os.use(cacheMiddleware({ ttl: ONE_DAY })).handler(async () => {
  const [categoryCount, subCategoryCount] = await Promise.all([prisma.category.count(), prisma.subCategory.count()]);
  return { categoryCount, subCategoryCount };
});
