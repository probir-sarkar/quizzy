import {
  getQuizCategoryInfo,
  getSubCategoriesByCategory,
  getQuizzesByCategory,
  getQuizDetail,
  getMoreQuizzes,
  getQuizMetadata,
  getQuiz,
  getHomePageData
} from "./quiz";
import { getAllHoroscopesForDate } from "./horoscope";
import { getPastEventsByMonthDay } from "./past-event";
import { getAllCategoriesWithStats, getCategoryCounts } from "./category";

// Aggregate all routes
export const router = {
  // Quiz routes
  getQuizCategoryInfo,
  getSubCategoriesByCategory,
  getQuizzesByCategory,
  getQuizDetail,
  getMoreQuizzes,
  getQuizMetadata,
  getQuiz,
  getHomePageData,
  getAllCategoriesWithStats,
  getCategoryCounts,

  // Horoscope routes
  getAllHoroscopesForDate,

  // Past event routes
  getPastEventsByMonthDay
};
