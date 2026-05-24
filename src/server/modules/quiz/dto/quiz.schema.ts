import { z } from "zod";

// Common validators
export const slugSchema = z.string();

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().optional(),
  perPage: z.number().optional()
});

// DTO: Get quiz by slug
export const getQuizSchema = z.object({
  slug: slugSchema
});

export type GetQuizDto = z.infer<typeof getQuizSchema>;

// DTO: Get category info by slug
export const getCategoryInfoSchema = z.object({
  slug: slugSchema
});

export type GetCategoryInfoDto = z.infer<typeof getCategoryInfoSchema>;

// DTO: Get quizzes by category
export const getQuizzesByCategorySchema = z.object({
  categorySlug: slugSchema,
  subCategorySlug: slugSchema.optional().nullable(),
  ...paginationSchema.shape
});

export type GetQuizzesByCategoryDto = z.infer<typeof getQuizzesByCategorySchema>;

// DTO: Get categories with stats (paginated)
export const getCategoriesWithStatsSchema = paginationSchema;

export type GetCategoriesWithStatsDto = z.infer<typeof getCategoriesWithStatsSchema>;
