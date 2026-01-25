"use client";

import { motion, Variants } from "motion/react";
import { useMemo } from "react";
import { useQuizStore, useQuizScore, getQuizScoreMessage, getQuizScoreColor } from "@/stores/quiz-store";

export default function QuizResults() {
  const showResults = useQuizStore((state) => state.showResults);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);
  const { correct, total, percentage } = useQuizScore();

  const scoreMessage = useMemo(() => getQuizScoreMessage(percentage), [percentage]);
  const scoreColor = useMemo(() => getQuizScoreColor(percentage), [percentage]);

  if (!showResults) return null;

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.08
      }
    }
  };

  const slideUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const scaleInVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  const pulseVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Container with Glass Morphism */}
      <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5" />

        <div className="relative max-w-6xl mx-auto px-4 py-4 sm:py-6">
          {/* Header Section with Score */}
          <motion.div className="text-center mb-4 sm:mb-6" variants={slideUpVariants}>
            <motion.div className="inline-flex flex-col items-center" variants={scaleInVariants}>
              {/* Score Badge */}
              <motion.div
                className={`relative inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${scoreColor} shadow-lg mb-3`}
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 rounded-2xl bg-white/20" />
                <span className="relative text-lg sm:text-xl font-bold dark:text-white text-gray-900 ">
                  {percentage}%
                </span>
              </motion.div>

              <motion.h2
                className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2"
                variants={slideUpVariants}
              >
                🎉 Quiz Complete!
              </motion.h2>

              <motion.p className={`text-sm sm:text-base font-medium ${scoreColor}`} variants={slideUpVariants}>
                {scoreMessage}
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Score Statistics Cards */}
          <motion.div
            className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 max-w-xs mx-auto"
            variants={slideUpVariants}
          >
            <motion.div
              className="relative bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-3 sm:p-4 border border-green-200/50 dark:border-green-700/30"
              variants={scaleInVariants}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-green-600 dark:text-green-400">Correct</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300">{correct}</div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                {total > 0 ? Math.round((correct / total) * 100) : 0}% accuracy
              </div>
            </motion.div>

            <motion.div
              className="relative bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-3 sm:p-4 border border-red-200/50 dark:border-red-700/30"
              variants={scaleInVariants}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-red-600 dark:text-red-400">Incorrect</span>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-red-700 dark:text-red-300">{total - correct}</div>
              <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                {total > 0 ? Math.round(((total - correct) / total) * 100) : 0}% missed
              </div>
            </motion.div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div className="mb-4 sm:mb-6" variants={slideUpVariants}>
            <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${
                  percentage >= 80
                    ? "from-green-400 to-green-600"
                    : percentage >= 60
                    ? "from-yellow-400 to-orange-500"
                    : "from-red-400 to-red-600"
                } rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div className="flex justify-center" variants={slideUpVariants}>
            <motion.button
              onClick={resetQuiz}
              className="group relative inline-flex items-center px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              variants={pulseVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center text-sm sm:text-base">
                <motion.svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </motion.svg>
                Try Another Quiz
              </span>
            </motion.button>
          </motion.div>

          {/* Decorative Floating Elements */}
          <motion.div
            className="absolute top-4 left-4 w-2 h-2 bg-purple-400 rounded-full opacity-60"
            animate={{
              y: [0, -8, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-2 right-6 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-60"
            animate={{
              y: [0, -6, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          <motion.div
            className="absolute bottom-3 right-8 w-2.5 h-2.5 bg-pink-400 rounded-full opacity-60"
            animate={{
              y: [0, -10, 0],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
