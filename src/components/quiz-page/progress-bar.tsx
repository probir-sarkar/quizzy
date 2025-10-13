"use client";

import { motion } from 'framer-motion';
import { useQuizStore, useQuizProgress } from '@/stores/quiz-store';

export default function QuizProgressBar() {
  const answers = useQuizStore((state) => state.answers);
  const currentQuiz = useQuizStore((state) => state.currentQuiz);
  const progress = useQuizProgress();

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = currentQuiz?.length || 0;

  return (
    <motion.div
      className="sticky top-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.div
              className="text-lg font-semibold text-gray-900 dark:text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Quiz Progress
            </motion.div>
            <motion.div
              className="text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {answeredCount} of {totalQuestions} questions answered
            </motion.div>
          </div>

          <motion.div
            className="text-sm font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className={`px-3 py-1 rounded-full ${
              progress === 100
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            }`}>
              {Math.round(progress)}%
            </span>
          </motion.div>
        </div>

        <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full shadow-lg"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: 0.8,
              delay: 0.2
            }}
          >
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-full"
              animate={{
                background: [
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
        </div>

        {progress === 100 && (
          <motion.div
            className="mt-3 text-center text-sm font-medium text-green-600 dark:text-green-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            🎉 Quiz completed! Scroll down to see your results.
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}