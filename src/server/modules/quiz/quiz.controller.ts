import { QuizService, shuffleOptions } from "./quiz.service";
import { os } from "@orpc/server";
import * as D from "./dto/quiz.schema";
import { cacheMiddleware, ONE_DAY, ONE_HOUR } from "@/server/middleware/cache.middleware";

export const getHomePageData = os
  .use(
    cacheMiddleware({
      ttl: ONE_HOUR
    })
  )
  .output(D.homePageDataOutputSchema)
  .handler(async () => {
    const [stats, homePageData, categories] = await Promise.all([
      QuizService.getHomePageStats(),
      QuizService.getHomePageData(),
      QuizService.getCategories()
    ]);

    return { stats, homePageData, categories };
  });

export const getQuizCategoryInfo = os
  .input(D.getCategoryInfoSchema)
  .output(D.categoryInfoOutputSchema)
  .handler(async ({ input: { slug } }) => {
    return await QuizService.getCategoryInfo(slug);
  });

export const getSubCategoriesByCategory = os
  .use(cacheMiddleware({ ttl: ONE_HOUR }))
  .input(D.getSubCategoriesByCategorySchema)
  .output(D.subCategoriesByCategoryOutputSchema)
  .handler(async ({ input: { slug } }) => {
    return await QuizService.getSubCategoriesByCategory(slug);
  });

export const getQuizzesByCategory = os
  .input(D.getQuizzesByCategorySchema)
  .output(D.quizzesByCategoryOutputSchema)
  .handler(async ({ input }) => {
    return await QuizService.getQuizzesByCategory(input);
  });

export const getQuizDetail = os
  .use(cacheMiddleware({ ttl: ONE_DAY }))
  .input(D.getQuizSchema)
  .output(D.quizDetailOutputSchema)
  .handler(async ({ input: { slug } }) => {
    const quiz = await QuizService.getQuiz(slug);
    if (!quiz) return null;
    return {
      ...quiz,
      questions: quiz.questions.map(shuffleOptions)
    };
  });

export const getMoreQuizzes = os
  .input(D.getQuizSchema)
  .output(D.moreQuizzesOutputSchema)
  .handler(async ({ input: { slug } }) => {
    return await QuizService.getMoreQuizzes(slug);
  });

export const getQuizMetadata = os
  .use(cacheMiddleware({ ttl: ONE_HOUR }))
  .input(D.getQuizSchema)
  .output(D.quizMetadataOutputSchema)
  .handler(async ({ input: { slug } }) => {
    return await QuizService.getQuizForMetadata(slug);
  });

export const getQuiz = os
  .use(cacheMiddleware({ ttl: ONE_HOUR }))
  .input(D.getQuizSchema)
  .output(D.quizDetailOutputSchema)
  .handler(async ({ input: { slug } }) => {
    return await QuizService.getQuiz(slug);
  });
