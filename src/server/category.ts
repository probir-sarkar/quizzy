import { os } from "@orpc/server";
import { z } from "zod";
import { isoDate } from "./common";
import { db } from "@/lib/prisma";
import { cacheMiddleware, ONE_DAY } from "./cache.middleware";

const categoryWithCountsSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  createdAt: isoDate,
  _count: z.object({ quizzes: z.number(), subCategories: z.number() })
});

export const getAllCategoriesWithStats = os
  .use(cacheMiddleware({ ttl: ONE_DAY }))
  .output(
    z.object({
      categories: z.array(categoryWithCountsSchema),
      totalCategories: z.number(),
      totalSubcategories: z.number()
    })
  )
  .handler(async () => {
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
      categories: result,
      totalCategories: result.length,
      totalSubcategories: result.reduce((sum, cat) => sum + (cat._count.subCategories ?? 0), 0)
    };
  });

export const getCategoryCounts = os
  .use(cacheMiddleware({ ttl: ONE_DAY }))
  .output(
    z.object({
      categoryCount: z.number(),
      subCategoryCount: z.number()
    })
  )
  .handler(async () => {
    const [categoryTotals, subCategoryTotals] = await Promise.all([
      db.orm.public.Category.aggregate((agg) => ({ count: agg.count() })),
      db.orm.public.SubCategory.aggregate((agg) => ({ count: agg.count() }))
    ]);
    return { categoryCount: categoryTotals.count, subCategoryCount: subCategoryTotals.count };
  });
