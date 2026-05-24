import { QuizService, shuffleOptions } from "./quiz.service";
import { os } from "@orpc/server";
import { z } from "zod";

export const getQuizStats = os.handler(async () => {
  return await QuizService.getHomePageStats();
});

export const getQuizHomeData = os.handler(async () => {
  return await QuizService.getHomePageData();
});

export const getQuizCategories = os.handler(async () => {
  return await QuizService.getCategories();
});

export const getQuizCategoryInfo = os
  .input(
    z.object({
      slug: z.string()
    })
  )
  .handler(async ({ input: { slug } }) => {
    return await QuizService.getCategoryInfo(slug);
  });

export const getQuizzesByCategory = os
  .input(
    z.object({
      categorySlug: z.string(),
      page: z.number().optional(),
      perPage: z.number().optional(),
      subCategorySlug: z.string().optional()
    })
  )
  .handler(async ({ input }) => {
    return await QuizService.getQuizzesByCategory(input);
  });

export const getCategoriesWithStats = os
  .input(
    z.object({
      page: z.number().optional(),
      perPage: z.number().optional()
    })
  )
  .handler(async ({ input }) => {
    return await QuizService.getCategoriesWithStats(input);
  });

export const getQuizDetail = os
  .input(
    z.object({
      slug: z.string()
    })
  )
  .handler(async ({ input: { slug } }) => {
    const quiz = await QuizService.getQuiz(slug);
    return {
      ...quiz,
      questions: quiz?.questions?.map(shuffleOptions),
    };
  });

export const getMoreQuizzes = os
  .input(
    z.object({
      slug: z.string()
    })
  )
  .handler(async ({ input: { slug } }) => {
    return await QuizService.getMoreQuizzes(slug);
  });

export const getQuizMetadata = os
  .input(
    z.object({
      slug: z.string()
    })
  )
  .handler(async ({ input: { slug } }) => {
    return await QuizService.getQuizForMetadata(slug);
  });

export const getQuiz = os
  .input(
    z.object({
      slug: z.string()
    })
  )
  .handler(async ({ input: { slug } }) => {
    return await QuizService.getQuiz(slug);
  });

export const getCategoriesStats = os.handler(async () => {
  return await QuizService.getCategoriesStats();
});
