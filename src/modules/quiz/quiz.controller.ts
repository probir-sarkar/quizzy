import Elysia from "elysia";
import { QuizService } from "./quiz.service";

export const QuizController = new Elysia({ prefix: "/quiz" })
  .get("/stats", () => QuizService.getHomePageStats())
  .get("/home-data", () => QuizService.getHomePageData())
  .get("/categories", () => QuizService.getCategories());
