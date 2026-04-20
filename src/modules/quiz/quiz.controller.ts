import Elysia, { t } from "elysia";
import { QuizService } from "./quiz.service";

export const QuizController = new Elysia({ prefix: "/quiz" })
  .get("/stats", () => QuizService.getHomePageStats())
  .get("/home-data", () => QuizService.getHomePageData())
  .get("/categories", () => QuizService.getCategories())
  .get("/by-category", ({ query }) => {
    return QuizService.getQuizzesByCategory({
      categorySlug: query.categorySlug,
      page: query.page,
      perPage: query.perPage,
      subCategorySlug: query.subCategorySlug
    });
  }, {
    query: t.Object({
      categorySlug: t.String(),
      page: t.Optional(t.Number()),
      perPage: t.Optional(t.Number()),
      subCategorySlug: t.Optional(t.String())
    })
  })
  .get("/categories-with-stats", ({ query }) => {
    return QuizService.getCategoriesWithStats({
      page: query.page,
      perPage: query.perPage
    });
  }, {
    query: t.Object({
      page: t.Optional(t.Number()),
      perPage: t.Optional(t.Number())
    })
  })
  .get("/detail", ({ query }) => {
    return QuizService.getQuiz(query.slug);
  }, {
    query: t.Object({
      slug: t.String()
    })
  })
  .get("/more", ({ query }) => {
    return QuizService.getMoreQuizzes(query.slug);
  }, {
    query: t.Object({
      slug: t.String()
    })
  })
  .get("/metadata", ({ query }) => {
    return QuizService.getQuizForMetadata(query.slug);
  }, {
    query: t.Object({
      slug: t.String()
    })
  });
