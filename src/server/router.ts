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

  // Past event routes
  getPastEventsByMonthDay
};
