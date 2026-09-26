import { db } from "@/lib/prisma";
import { or } from "@prisma/orm-postgres/orm-client";
import { shuffle } from "es-toolkit/array";
import * as D from "./dto/quiz.schema";

export type GetQuizzesByCategoryOpts = D.GetQuizzesByCategoryDto;

export const DEFAULT_PER_PAGE = 12;
export function shuffleOptions(question: D.QuestionDto): D.QuestionDto {
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
  }: GetQuizzesByCategoryOpts) {
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
