import { QuizService } from "@/modules/quiz/quiz.service";
import { os } from "@orpc/server";
import { z } from "zod";

export const getQuiz = os
  .input(
    z.object({
      slug: z.string()
    })
  )
  .handler(async ({ input: { slug } }) => {
    return await QuizService.getQuiz(slug);
  });
