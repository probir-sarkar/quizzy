import { os } from "@orpc/server";
import { db } from "@/lib/prisma";
import { cacheMiddleware, ONE_DAY } from "../middleware/cache.middleware";

export const getAllCategoriesWithStats = os.use(cacheMiddleware({ ttl: ONE_DAY })).handler(async () => {
  const categories = await db.orm.public.Category.include("quizzes", (quizzes) => quizzes.count())
    .include("subCategories", (subCategories) => subCategories.count())
    .orderBy((cat) => cat.name.asc())
    .all();

  const result = categories.map((cat) => {
    return {
      ...cat,
      _count: {
        quizzes: cat.quizzes,
        subCategories: cat.subCategories
      }
    };
  });
  return {
    categories: result
  };
});

export const getCategoryCounts = os.use(cacheMiddleware({ ttl: ONE_DAY })).handler(async () => {
  const [categoryTotals, subCategoryTotals] = await Promise.all([
    db.orm.public.Category.aggregate((agg) => ({ count: agg.count() })),
    db.orm.public.SubCategory.aggregate((agg) => ({ count: agg.count() }))
  ]);
  return { categoryCount: categoryTotals.count, subCategoryCount: subCategoryTotals.count };
});
