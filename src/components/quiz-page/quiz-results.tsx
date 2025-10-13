"use client";

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useQuizStore, useQuizScore, getQuizScoreMessage, getQuizScoreColor } from '@/stores/quiz-store';

export default function QuizResults() {
  const showResults = useQuizStore((state) => state.showResults);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);
  const { correct, total, percentage } = useQuizScore();

  const scoreMessage = useMemo(() => getQuizScoreMessage(percentage), [percentage]);
  const scoreColor = useMemo(() => getQuizScoreColor(percentage), [percentage]);

  if (!showResults) return null;

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const scoreCircleVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

            {/* Score Circle */}
            <motion.div
              className="flex justify-center lg:justify-start"
              variants={itemVariants}
            >
              <div className="text-center lg:text-left">
                <motion.div
                  className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-white dark:bg-gray-800 shadow-xl mb-4 ${scoreColor}`}
                  variants={scoreCircleVariants}
                >
                  <span className="text-3xl font-bold">{percentage}%</span>
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Quiz Completed!
                </h3>
              </div>
            </motion.div>

            {/* Score Details */}
            <motion.div
              className="flex justify-center"
              variants={itemVariants}
            >
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl p-6 text-center shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {correct}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Correct Answers
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl p-6 text-center shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                    {total - correct}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Incorrect Answers
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              className="flex flex-col items-center lg:items-end justify-center gap-4"
              variants={itemVariants}
            >
              <motion.p
                className={`text-lg font-semibold ${scoreColor} text-center lg:text-right`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {scoreMessage}
              </motion.p>

              <motion.button
                onClick={resetQuiz}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mr-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </motion.div>
                Try Again
              </motion.button>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <motion.div
            className="absolute top-2 left-4 w-2 h-2 bg-purple-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-4 right-8 w-3 h-3 bg-blue-400 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          <motion.div
            className="absolute bottom-4 left-1/4 w-2 h-2 bg-pink-400 rounded-full"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>
      </div>

      {/* Add some padding to prevent content from being hidden behind the fixed results */}
      <div className="h-4" />
    </motion.div>
  );
}