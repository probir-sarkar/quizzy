/**
 * Quiz utility functions for scoring and UI feedback
 */

/**
 * Get quiz score message based on percentage
 */
export function getQuizScoreMessage(percentage: number): string {
  if (percentage === 100) return "Perfect! You're a master! 🏆";
  if (percentage >= 80) return "Excellent work! 🌟";
  if (percentage >= 60) return "Good job! Keep it up! 👍";
  if (percentage >= 40) return "Not bad! Room for improvement! 📚";
  return "Keep practicing! You'll get better! 💪";
}

/**
 * Get quiz score color class based on percentage
 */
export function getQuizScoreColor(percentage: number): string {
  if (percentage >= 80) return "text-green-600 dark:text-green-400";
  if (percentage >= 60) return "text-blue-600 dark:text-blue-400";
  if (percentage >= 40) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

/**
 * Calculate quiz score from answers and questions
 */
export function calculateQuizScore(
  answers: Record<number, number>,
  questions: Array<{ correctIndex: number }>
): { correct: number; total: number; percentage: number } {
  let correct = 0;
  questions.forEach((question, index) => {
    if (answers[index] === question.correctIndex) {
      correct++;
    }
  });

  const total = questions.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return { correct, total, percentage };
}
