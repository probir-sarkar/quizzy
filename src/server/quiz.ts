import { db } from "@/lib/prisma";
import { or } from "@prisma/orm-postgres/orm-client";
import { shuffle } from "es-toolkit/array";
import { os } from "@orpc/server";
import { z } from "zod";
import { QuizDifficulty } from "@/lib/enums";
import { isoDate } from "./common";
import { cacheMiddleware, ONE_DAY, ONE_HOUR } from "./cache.middleware";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const slugSchema = z.string();

const paginationSchema = z.object({
  page: z.number().optional(),
  perPage: z.number().optional()
});

const getQuizSchema = z.object({
  slug: slugSchema
});

const getQuizzesByCategorySchema = z.object({
  categorySlug: slugSchema,
  subCategorySlug: slugSchema.optional().nullable(),
  ...paginationSchema.shape
});

export type GetQuizzesByCategoryDto = z.infer<typeof getQuizzesByCategorySchema>;

const categoryRowSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  createdAt: isoDate
});

const subCategoryRowSchema = z.object({
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

// Output: getHomePageData
const homePageDataOutputSchema = z.object({
  stats: z.object({
    totalQuizzes: z.number(),
    totalCategories: z.number(),
    totalSubCategories: z.number()
  }),
  homePageData: z.array(categoryWithQuizzesSchema),
  categories: z.array(categoryRowSchema)
});

// Output: getQuizCategoryInfo
const categoryInfoOutputSchema = categoryWithSubCategoriesSchema.nullable();

// Output: getSubCategoriesByCategory
const subCategoriesByCategoryOutputSchema = z.array(subCategoryWithCountSchema);

// Output: getQuizzesByCategory
const quizzesByCategoryOutputSchema = z.object({
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

// Output: getQuizDetail / getQuiz
const quizDetailOutputSchema = quizDetailWithCountSchema.nullable();

// Output: getMoreQuizzes
const moreQuizzesOutputSchema = z.array(quizWithQuestionCountSchema);

// Output: getQuizMetadata
const quizMetadataOutputSchema = z
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

export type QuestionDto = z.infer<typeof questionRowSchema>;
export type QuizCardDto = z.infer<typeof quizWithQuestionCountSchema>;
export type QuizDetailDto = z.infer<typeof quizDetailWithCountSchema>;

// ---------------------------------------------------------------------------
// Data access
// ---------------------------------------------------------------------------

const DEFAULT_PER_PAGE = 12;

export function shuffleOptions(question: QuestionDto): QuestionDto {
  const optionsWithIndex = question.options.map((text, index) => ({
    text,
    index
  }));

  const shuffled = shuffle(optionsWithIndex);

  return {
    ...question,
    options: shuffled.map((o) => o.text),
    correctIndex: shuffled.findIndex((o) => o.index === question.correctIndex)
  };
}

// Map an include()'d questions count reducer onto the v7-style `_count` shape
const withQuestionCount = <T extends { questions: number }>(quiz: T) => {
  const { questions, ...rest } = quiz;
  return { ...rest, _count: { questions } };
};

// Map quizTags (with their tag) onto the v7-style `tags` array shape
const toTagRows = <TTag>(quizTags: Array<{ quizId: string; tagId: number; tag: TTag }>) =>
  quizTags.map(({ quizId, tagId, tag }) => ({ quizId, tagId, tag }));

export abstract class QuizService {
  static async getHomePageStats() {
    const [quizTotals, categoryTotals, subCategoryTotals] = await Promise.all([
      db.orm.public.Quiz.aggregate((agg) => ({ count: agg.count() })),
      db.orm.public.Category.aggregate((agg) => ({ count: agg.count() })),
      db.orm.public.SubCategory.aggregate((agg) => ({ count: agg.count() }))
    ]);

    return {
      totalQuizzes: quizTotals.count,
      totalCategories: categoryTotals.count,
      totalSubCategories: subCategoryTotals.count
    };
  }

  static async getHomePageData() {
    const categories = await db.orm.public.Category
      .where((cat) => cat.quizzes.some())
      .limit(12)
      .include("quizzes", (quizzes) =>
        quizzes
          .include("category", (category) => category)
          .include("questions", (questions) => questions.count())
          .orderBy((quiz) => quiz.createdAt.desc())
          .limit(4)
      )
      .all();

    return categories.map((category) => ({
      ...category,
      quizzes: category.quizzes.map(withQuestionCount)
    }));
  }

  static async getCategories() {
    return db.orm.public.Category.orderBy((cat) => cat.name.asc()).all();
  }

  static async getCategoryInfo(slug: string) {
    const category = await db.orm.public.Category
      .include("subCategories", (subCategories) =>
        subCategories.include("quizzes", (quizzes) => quizzes.count())
      )
      .include("quizzes", (quizzes) => quizzes.count())
      .first({ slug });

    if (!category) return null;

    const { quizzes: quizCount, subCategories: subRows, ...categoryFields } = category;

    return {
      ...categoryFields,
      subCategories: subRows
        .map(({ quizzes, ...sub }) => ({ ...sub, _count: { quizzes } }))
        .sort((a, b) => b._count.quizzes - a._count.quizzes),
      _count: { quizzes: quizCount }
    };
  }

  static async getSubCategoriesByCategory(slug: string) {
    const category = await db.orm.public.Category
      .include("subCategories", (subCategories) =>
        subCategories
          .select("id", "name", "slug")
          .include("quizzes", (quizzes) => quizzes.count())
      )
      .first({ slug });

    if (!category) return [];

    return category.subCategories
      .map(({ quizzes, ...sub }) => ({ ...sub, _count: { quizzes } }))
      .sort((a, b) => b._count.quizzes - a._count.quizzes);
  }

  static async getQuizzesByCategory({
    categorySlug,
    page = 1,
    perPage = DEFAULT_PER_PAGE,
    subCategorySlug = null
  }: GetQuizzesByCategoryDto) {
    const actualPage = page ?? 1;
    const actualPerPage = perPage ?? DEFAULT_PER_PAGE;
    const skip = (actualPage - 1) * actualPerPage;

    const category = await db.orm.public.Category
      .include("subCategories", (subCategories) =>
        subCategories.include("quizzes", (quizzes) => quizzes.count())
      )
      .include("quizzes", (quizzes) => quizzes.count())
      .first({ slug: categorySlug });

    if (!category) {
      return {
        items: [],
        category: null,
        meta: {
          total: 0,
          totalPages: 1,
          currentPage: actualPage,
          perPage: actualPerPage
        }
      };
    }

    let subCategoryId: number | null = null;
    if (subCategorySlug) {
      const subCategory = await db.orm.public.SubCategory
        .where((sub) => sub.categoryId.eq(category.id))
        .where((sub) => sub.slug.eq(subCategorySlug))
        .select("id")
        .first();
      subCategoryId = subCategory?.id ?? null;
    }

    const quizFilters = db.orm.public.Quiz.where((quiz) => quiz.categoryId.eq(category.id));
    const filteredQuizzes = subCategoryId
      ? quizFilters.where((quiz) => quiz.subCategoryId.eq(subCategoryId))
      : quizFilters;

    const [totals, items] = await Promise.all([
      filteredQuizzes.aggregate((agg) => ({ count: agg.count() })),
      filteredQuizzes
        .orderBy((quiz) => quiz.createdAt.desc())
        .offset(skip)
        .limit(actualPerPage)
        .include("category", (category) => category)
        .include("subCategory", (subCategory) => subCategory)
        .include("quizTags", (quizTags) =>
          quizTags.include("tag", (tag) => tag)
        )
        .include("questions", (questions) => questions.count())
        .all()
    ]);

    const totalPages = Math.max(1, Math.ceil(totals.count / actualPerPage));

    return {
      items: items.map((quiz) => {
        const { quizTags, questions, ...quizFields } = quiz;
        return {
          ...quizFields,
          tags: toTagRows(quizTags),
          _count: { questions }
        };
      }),
      category: (() => {
        const { quizzes: quizCount, subCategories: subRows, ...categoryFields } = category;
        return {
          ...categoryFields,
          subCategories: subRows.map(({ quizzes, ...sub }) => ({ ...sub, _count: { quizzes } })),
          _count: { quizzes: quizCount }
        };
      })(),
      meta: {
        total: totals.count,
        totalPages,
        currentPage: actualPage,
        perPage: actualPerPage
      }
    };
  }

  // Cached base query for quiz - shared by getQuiz and getQuizForMetadata
  static cachedGetQuizBase = async (slug: string) => {
    const quiz = await db.orm.public.Quiz
      .select(
        "id",
        "quizPageTitle",
        "quizPageDescription",
        "difficulty",
        "title",
        "description",
        "slug",
        "isPublished",
        "publishedAt",
        "views",
        "categoryId",
        "subCategoryId"
      )
      .include("category", (category) => category.select("id", "name", "slug"))
      .include("questions", (questions) =>
        questions
          .select("id", "quizId", "text", "options", "correctIndex", "explanation")
          .orderBy((question) => question.id.asc())
      )
      .include("quizTags", (quizTags) =>
        quizTags
          .select("quizId", "tagId")
          .include("tag", (tag) => tag.select("id", "name"))
      )
      .first({ slug });

    if (!quiz) return null;

    const { quizTags, ...quizFields } = quiz;

    return {
      ...quizFields,
      questions: quiz.questions.map((question) => ({
        ...question,
        options: [...(question.options ?? [])]
      })),
      tags: toTagRows(quizTags)
    };
  };

  static async getQuiz(slug: string) {
    const quiz = await this.cachedGetQuizBase(slug);

    if (!quiz) return null;

    return {
      ...quiz,
      _count: {
        questions: quiz.questions.length
      }
    };
  }

  static async getMoreQuizzes(slug: string) {
    const quiz = await db.orm.public.Quiz
      .select("id", "categoryId", "subCategoryId")
      .include("quizTags", (quizTags) => quizTags.select("tagId"))
      .first({ slug });

    if (!quiz) return [];

    const tagIds = quiz.quizTags.map((t) => t.tagId);

    const items = await db.orm.public.Quiz
      .where((q) =>
        or(
          quiz.categoryId === null ? q.categoryId.isNull() : q.categoryId.eq(quiz.categoryId),
          quiz.subCategoryId === null ? q.subCategoryId.isNull() : q.subCategoryId.eq(quiz.subCategoryId),
          ...(tagIds.length ? [q.quizTags.some((qt) => qt.tagId.in(tagIds))] : [])
        )
      )
      .where((q) => q.id.neq(quiz.id))
      .include("category", (category) => category)
      .include("questions", (questions) => questions.count())
      .limit(6)
      .all();

    return items.map(withQuestionCount);
  }

  static async getQuizForMetadata(slug: string) {
    const quiz = await this.cachedGetQuizBase(slug);

    if (!quiz) return null;

    return {
      title: quiz.title,
      description: quiz.description,
      quizPageTitle: quiz.quizPageTitle,
      quizPageDescription: quiz.quizPageDescription,
      category: quiz.category,
      tags: quiz.tags
    };
  }
}

// ---------------------------------------------------------------------------
// Procedures
// ---------------------------------------------------------------------------

export const getHomePageData = os
  .use(
    cacheMiddleware({
      ttl: ONE_HOUR
    })
  )
  .output(homePageDataOutputSchema)
  .handler(async () => {
    const [stats, homePageData, categories] = await Promise.all([
      QuizService.getHomePageStats(),
      QuizService.getHomePageData(),
      QuizService.getCategories()
    ]);

    return { stats, homePageData, categories };
  });

export const getQuizCategoryInfo = os
  .input(getQuizSchema)
  .output(categoryInfoOutputSchema)
  .handler(async ({ input: { slug } }) => {
    return await QuizService.getCategoryInfo(slug);
  });

export const getSubCategoriesByCategory = os
  .use(cacheMiddleware({ ttl: ONE_HOUR }))
  .input(getQuizSchema)
  .output(subCategoriesByCategoryOutputSchema)
  .handler(async ({ input: { slug } }) => {
    return await QuizService.getSubCategoriesByCategory(slug);
  });

export const getQuizzesByCategory = os
  .input(getQuizzesByCategorySchema)
  .output(quizzesByCategoryOutputSchema)
  .handler(async ({ input }) => {
    return await QuizService.getQuizzesByCategory(input);
  });

export const getQuizDetail = os
  .use(cacheMiddleware({ ttl: ONE_DAY }))
  .input(getQuizSchema)
  .output(quizDetailOutputSchema)
  .handler(async ({ input: { slug } }) => {
    const quiz = await QuizService.getQuiz(slug);
    if (!quiz) return null;
    return {
      ...quiz,
      questions: quiz.questions.map(shuffleOptions)
    };
  });

export const getMoreQuizzes = os
  .input(getQuizSchema)
  .output(moreQuizzesOutputSchema)
  .handler(async ({ input: { slug } }) => {
    return await QuizService.getMoreQuizzes(slug);
  });

export const getQuizMetadata = os
  .use(cacheMiddleware({ ttl: ONE_HOUR }))
  .input(getQuizSchema)
  .output(quizMetadataOutputSchema)
  .handler(async ({ input: { slug } }) => {
    return await QuizService.getQuizForMetadata(slug);
  });

export const getQuiz = os
  .use(cacheMiddleware({ ttl: ONE_HOUR }))
  .input(getQuizSchema)
  .output(quizDetailOutputSchema)
  .handler(async ({ input: { slug } }) => {
    return await QuizService.getQuiz(slug);
  });
