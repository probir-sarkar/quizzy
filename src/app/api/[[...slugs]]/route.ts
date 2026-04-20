import { QuizController } from "@/modules/quiz/quiz.controller";
import { HoroscopeController } from "@/modules/horoscope/horoscope.controller";
import { PastEventController } from "@/modules/past-event/past-event.controller";
import { Elysia, t } from "elysia";

export const app = new Elysia({ prefix: "/api" })
  .use(QuizController)
  .use(HoroscopeController)
  .use(PastEventController);

export const GET = app.fetch;
export const POST = app.fetch;
