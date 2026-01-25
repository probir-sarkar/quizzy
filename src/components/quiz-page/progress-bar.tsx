"use client";

import { motion } from 'motion/react';
import { useQuizStore, useQuizProgress } from '@/stores/quiz-store';

export default function QuizProgressBar() {
  const answers = useQuizStore((state) => state.answers);
  const currentQuiz = useQuizStore((state) => state.currentQuiz);
  const progress = useQuizProgress();

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = currentQuiz?.length || 0;

  return (
    <motion.div
      className="sticky top-16 z-40"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Glass Morphism Container */}
      <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-700/30 shadow-sm">

        {/* Subtle Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-purple-500/3 to-pink-500/3" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-3">

          {/* Top Row with Title and Stats */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.div
                className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                Progress
              </motion.div>
              <motion.div
                className="text-xs sm:text-sm text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                {answeredCount}/{totalQuestions}
              </motion.div>
            </div>

            <motion.div
              className="text-xs sm:text-sm font-medium"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${
                progress === 100
                  ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 dark:from-green-900/20 dark:to-green-800/20 dark:text-green-300'
                  : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 dark:from-blue-900/20 dark:to-blue-800/20 dark:text-blue-300'
              }`}>
                {Math.round(progress)}%
                {progress === 100 && (
                  <motion.span
                    className="ml-1"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ✨
                  </motion.span>
                )}
              </span>
            </motion.div>
          </div>

          {/* Sleek Progress Bar */}
          <div className="relative w-full h-1.5 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
            {/* Glass Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />

            {/* Progress Fill */}
            <motion.div
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                progress === 100
                  ? 'bg-gradient-to-r from-green-400 via-emerald-400 to-green-500'
                  : 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: "easeOut"
              }}
            >
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                animate={{
                  x: ["-100%", "200%"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 1
                }}
              />

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
            </motion.div>
          </div>

          {/* Completion Message */}
          {progress === 100 && (
            <motion.div
              className="mt-2 text-center"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/20 dark:to-emerald-900/20 dark:text-green-300 rounded-full">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="mr-1"
                >
                  🎉
                </motion.span>
                Complete! Scroll down for results
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}