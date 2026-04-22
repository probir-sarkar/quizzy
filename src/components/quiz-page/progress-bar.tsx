"use client";

import { useQuizStore, useQuizProgress } from '@/stores/quiz-store';
import { memo } from 'react';

function QuizProgressBar() {
  const answers = useQuizStore((state) => state.answers);
  const currentQuiz = useQuizStore((state) => state.currentQuiz);
  const progress = useQuizProgress();

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = currentQuiz?.length || 0;

  return (
    <div className="sticky top-16 z-40">
      {/* Glass Morphism Container */}
      <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-700/30 shadow-sm">

        {/* Subtle Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-purple-500/3 to-pink-500/3" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-3">

          {/* Top Row with Title and Stats */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                Progress
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {answeredCount}/{totalQuestions}
              </div>
            </div>

            <div className="text-xs sm:text-sm font-medium">
              <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${
                progress === 100
                  ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 dark:from-green-900/20 dark:to-green-800/20 dark:text-green-300'
                  : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 dark:from-blue-900/20 dark:to-blue-800/20 dark:text-blue-300'
              }`}>
                {Math.round(progress)}%
                {progress === 100 && (
                  <span className="ml-1">✨</span>
                )}
              </span>
            </div>
          </div>

          {/* Sleek Progress Bar */}
          <div className="relative w-full h-1.5 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
            {/* Glass Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />

            {/* Progress Fill */}
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                progress === 100
                  ? 'bg-gradient-to-r from-green-400 via-emerald-400 to-green-500'
                  : 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400'
              }`}
              style={{ width: `${progress}%` }}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
            </div>
          </div>

          {/* Completion Message */}
          {progress === 100 && (
            <div className="mt-2 text-center">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/20 dark:to-emerald-900/20 dark:text-green-300 rounded-full">
                <span className="mr-1">🎉</span>
                Complete! Scroll down for results
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(QuizProgressBar);
