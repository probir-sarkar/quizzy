import { QuizController } from "@/modules/quiz/quiz.controller";
import { Elysia, t } from "elysia";

export const app = new Elysia({ prefix: "/api" }).use(QuizController);
export const GET = app.fetch;
export const POST = app.fetch;
