// Quiz Module
import {
  getQuizCategoryInfo,
  getQuizzesByCategory,
  getCategoriesWithStats,
  getCategoriesStats,
  getQuizDetail,
  getMoreQuizzes,
  getQuizMetadata,
  getQuiz,
  getHomePageData
} from "@/server/modules/quiz/quiz.controller";

// Horoscope Module
import { getAllHoroscopesForDate } from "@/server/modules/horoscope/horoscope.controller";

// Past Event Module
import { getPastEventsByMonthDay } from "@/server/modules/past-event/past-event.controller";
import { getAllCategoriesWithStats, getCategoryCounts } from "./modules/category";

// Aggregate all routes
export const router = {
  // Quiz routes

  getQuizCategoryInfo,
  getQuizzesByCategory,
  getCategoriesWithStats,
  getCategoriesStats,
  getAllCategoriesWithStats,
  getQuizDetail,
  getMoreQuizzes,
  getQuizMetadata,
  getQuiz,
  getHomePageData,
  // Horoscope routes
  getAllHoroscopesForDate,
  getCategoryCounts,

  // Past event routes
  getPastEventsByMonthDay
};
