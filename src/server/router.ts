// Quiz Module
import {
  getQuizStats,
  getQuizHomeData,
  getQuizCategories,
  getQuizCategoryInfo,
  getQuizzesByCategory,
  getCategoriesWithStats,
  getCategoriesStats,
  getQuizDetail,
  getMoreQuizzes,
  getQuizMetadata,
  getQuiz
} from "@/server/modules/quiz/quiz.controller";

// Horoscope Module
import { getAllHoroscopesForDate } from "@/server/modules/horoscope/horoscope.controller";

// Past Event Module
import { getPastEventsByMonthDay } from "@/server/modules/past-event/past-event.controller";

// Aggregate all routes
export const router = {
  // Quiz routes
  getQuizStats,
  getQuizHomeData,
  getQuizCategories,
  getQuizCategoryInfo,
  getQuizzesByCategory,
  getCategoriesWithStats,
  getCategoriesStats,
  getQuizDetail,
  getMoreQuizzes,
  getQuizMetadata,
  getQuiz,

  // Horoscope routes
  getAllHoroscopesForDate,

  // Past event routes
  getPastEventsByMonthDay
};
