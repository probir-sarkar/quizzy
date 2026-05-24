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

  const totalCategories = categories.length;
  const totalSubcategories = categories.reduce((sum, cat) => sum + (cat._count.subCategories ?? 0), 0);

  return {
    categories,
    totalCategories,
    totalSubcategories
  };
});
