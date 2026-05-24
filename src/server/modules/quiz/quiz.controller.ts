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
  .handler(async () => {
    const [stats, homePageData, categories] = await Promise.all([
      QuizService.getHomePageStats(),
      QuizService.getHomePageData(),
      QuizService.getCategories()
    ]);

    return { stats, homePageData, categories };
  });

export const getQuizCategoryInfo = os.input(D.getCategoryInfoSchema).handler(async ({ input: { slug } }) => {
  return await QuizService.getCategoryInfo(slug);
});

export const getQuizzesByCategory = os.input(D.getQuizzesByCategorySchema).handler(async ({ input }) => {
  return await QuizService.getQuizzesByCategory(input);
});

export const getCategoriesWithStats = os.input(D.getCategoriesWithStatsSchema).handler(async ({ input }) => {
  return await QuizService.getCategoriesWithStats(input);
});

export const getQuizDetail = os
  .use(cacheMiddleware({ ttl: ONE_DAY }))
  .input(D.getQuizSchema)
  .handler(async ({ input: { slug } }) => {
    const quiz = await QuizService.getQuiz(slug);
    return {
      ...quiz,
      questions: quiz?.questions?.map(shuffleOptions)
    };
  });

export const getMoreQuizzes = os.input(D.getQuizSchema).handler(async ({ input: { slug } }) => {
  return await QuizService.getMoreQuizzes(slug);
});

export const getQuizMetadata = os.input(D.getQuizSchema).handler(async ({ input: { slug } }) => {
  return await QuizService.getQuizForMetadata(slug);
});

export const getQuiz = os.input(D.getQuizSchema).handler(async ({ input: { slug } }) => {
  return await QuizService.getQuiz(slug);
});

export const getCategoriesStats = os.use(cacheMiddleware({ ttl: ONE_DAY })).handler(async () => {
  return await QuizService.getCategoriesStats();
});

