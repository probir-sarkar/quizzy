import Elysia from "elysia";
import { QuizService } from "./quiz.service";

export const QuizController = new Elysia({ prefix: "/quiz" })
  .get("/stats", () => QuizService.getHomePageStats())
  .get("/home-data", () => QuizService.getHomePageData())
  .get("/categories", () => QuizService.getCategories())
  .get("/by-category", ({ query }) => {
    const { categorySlug, page = 1, perPage = 12, subCategorySlug = null } = query as any;
    return QuizService.getQuizzesByCategory({
      categorySlug,
      page: Number(page),
      perPage: Number(perPage),
      subCategorySlug
    });
  })
  .get("/categories-with-stats", ({ query }) => {
    const { page = 1, perPage = 12 } = query as any;
    return QuizService.getCategoriesWithStats({
      page: Number(page),
      perPage: Number(perPage)
    });
  })
  .get("/detail", ({ query }) => {
    const { slug } = query as any;
    return QuizService.getQuiz(slug);
  })
  .get("/more", ({ query }) => {
    const { slug } = query as any;
    return QuizService.getMoreQuizzes(slug);
  })
  .get("/metadata", ({ query }) => {
    const { slug } = query as any;
    return QuizService.getQuizForMetadata(slug);
  });
