import { z } from "zod";
import { QuizDifficulty } from "@/lib/enums";
import { isoDate } from "@/server/dto/common";

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

// DTO: Get subCategories by category slug
export const getSubCategoriesByCategorySchema = z.object({
  slug: slugSchema
});

export type GetSubCategoriesByCategoryDto = z.infer<typeof getSubCategoriesByCategorySchema>;

// DTO: Get categories with stats (paginated)
export const getCategoriesWithStatsSchema = paginationSchema;

export type GetCategoriesWithStatsDto = z.infer<typeof getCategoriesWithStatsSchema>;

export const categoryRowSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  createdAt: isoDate
});

export const subCategoryRowSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  createdAt: isoDate
});

const subCategoryWithCountSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  _count: z.object({ quizzes: z.number() })
});

const subCategoryRowWithCountSchema = subCategoryRowSchema.extend({
  _count: z.object({ quizzes: z.number() })
});

const questionRowSchema = z.object({
  id: z.string(),
  quizId: z.string(),
  text: z.string(),
  options: z.array(z.string()),
  correctIndex: z.number(),
  explanation: z.string().nullable()
});

const tagRowSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: isoDate
});

const quizTagRowSchema = z.object({
  quizId: z.string(),
  tagId: z.number(),
  tag: tagRowSchema
});

const quizTagSummaryRowSchema = z.object({
  quizId: z.string(),
  tagId: z.number(),
  tag: z.object({ id: z.number(), name: z.string() })
});

const quizRowSchema = z.object({
  id: z.string(),
  quizPageTitle: z.string(),
  quizPageDescription: z.string(),
  difficulty: z.enum(QuizDifficulty),
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  isPublished: z.boolean(),
  publishedAt: isoDate.nullable(),
  views: z.number(),
  categoryId: z.number().nullable(),
  subCategoryId: z.number().nullable(),
  createdAt: isoDate,
  updatedAt: isoDate
});

const quizWithQuestionCountSchema = quizRowSchema.extend({
  category: categoryRowSchema.nullable(),
  _count: z.object({ questions: z.number() })
});

// The detail select fetches neither createdAt nor updatedAt — keep the
// payload lean and mirror that here.
const quizDetailSchema = quizRowSchema
  .omit({ createdAt: true, updatedAt: true })
  .extend({
  category: z
    .object({ id: z.number(), name: z.string(), slug: z.string() })
    .nullable(),
  questions: z.array(questionRowSchema),
  tags: z.array(quizTagSummaryRowSchema)
});

const quizDetailWithCountSchema = quizDetailSchema.extend({
  _count: z.object({ questions: z.number() })
});

const categoryWithQuizzesSchema = categoryRowSchema.extend({
  quizzes: z.array(quizWithQuestionCountSchema)
});

const categoryWithSubCategoriesSchema = categoryRowSchema.extend({
  subCategories: z.array(subCategoryRowWithCountSchema),
  _count: z.object({ quizzes: z.number() })
});

const categoryWithCountsSchema = categoryRowSchema.extend({
  _count: z.object({ quizzes: z.number(), subCategories: z.number() })
});

// Output: getHomePageData
export const homePageDataOutputSchema = z.object({
  stats: z.object({
    totalQuizzes: z.number(),
    totalCategories: z.number(),
    totalSubCategories: z.number()
  }),
  homePageData: z.array(categoryWithQuizzesSchema),
  categories: z.array(categoryRowSchema)
});

// Output: getQuizCategoryInfo
export const categoryInfoOutputSchema = categoryWithSubCategoriesSchema.nullable();

// Output: getSubCategoriesByCategory
export const subCategoriesByCategoryOutputSchema = z.array(subCategoryWithCountSchema);

// Output: getQuizzesByCategory
export const quizzesByCategoryOutputSchema = z.object({
  items: z.array(
    quizRowSchema.extend({
      category: categoryRowSchema.nullable(),
      subCategory: subCategoryRowSchema.nullable(),
      tags: z.array(quizTagRowSchema),
      _count: z.object({ questions: z.number() })
    })
  ),
  category: categoryWithSubCategoriesSchema.nullable(),
  meta: z.object({
    total: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    perPage: z.number()
  })
});

// Output: getAllCategoriesWithStats
export const allCategoriesWithStatsOutputSchema = z.object({
  categories: z.array(categoryWithCountsSchema),
  totalCategories: z.number(),
  totalSubcategories: z.number()
});

// Output: getQuizDetail / getQuiz
export const quizDetailOutputSchema = quizDetailWithCountSchema.nullable();

// Output: getMoreQuizzes
export const moreQuizzesOutputSchema = z.array(quizWithQuestionCountSchema);

// Output: getQuizMetadata
export const quizMetadataOutputSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    quizPageTitle: z.string(),
    quizPageDescription: z.string(),
    category: z
      .object({ id: z.number(), name: z.string(), slug: z.string() })
      .nullable(),
    tags: z.array(quizTagSummaryRowSchema)
  })
  .nullable();

// ---------------------------------------------------------------------------
// Derived types — single source of truth for quiz data crossing the API
// ---------------------------------------------------------------------------

export type CategoryRowDto = z.infer<typeof categoryRowSchema>;
export type SubCategoryWithCountDto = z.infer<typeof subCategoryWithCountSchema>;
export type QuestionDto = z.infer<typeof questionRowSchema>;
export type QuizTagRowDto = z.infer<typeof quizTagRowSchema>;
export type QuizCardDto = z.infer<typeof quizWithQuestionCountSchema>;
export type QuizDetailDto = z.infer<typeof quizDetailWithCountSchema>;
export type HomePageDataDto = z.infer<typeof homePageDataOutputSchema>;
export type QuizzesByCategoryDto = z.infer<typeof quizzesByCategoryOutputSchema>;
