import { create } from "zustand";
import { QuestionType } from "@/queries/home-page";
import { calculateQuizScore, getQuizScoreMessage, getQuizScoreColor } from "@/lib/quiz-utils";

interface QuizState {
  answers: { [key: number]: number };
  showResults: boolean;
  isCompleted: boolean;
  currentQuiz: QuestionType[] | null;

  // Actions
  setCurrentQuiz: (questions: QuestionType[]) => void;
  setAnswer: (questionIndex: number, answerIndex: number) => void;
  resetQuiz: () => void;
  showResultsNow: () => void;
  hideResults: () => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set, get, store) => ({
  answers: {},
  showResults: false,
  isCompleted: false,
  currentQuiz: null,

  setCurrentQuiz: (questions: QuestionType[]) => {
    const state = get();
    // Only update if the quiz has actually changed
    if (JSON.stringify(state.currentQuiz) !== JSON.stringify(questions)) {
      set({ currentQuiz: questions });
    }
  },

  setAnswer: (questionIndex: number, answerIndex: number) => {
    const state = get();
    // Only update if the answer is different
    if (state.answers[questionIndex] !== answerIndex) {
      const newAnswers = { ...state.answers, [questionIndex]: answerIndex };
      const answeredCount = Object.keys(newAnswers).length;
      const totalQuestions = state.currentQuiz?.length || 0;
      const isCompleted = answeredCount === totalQuestions && answeredCount > 0;

      set({
        answers: newAnswers,
        isCompleted
      });

      // Auto show results after completion
      if (isCompleted) {
        setTimeout(() => {
          set({ showResults: true });
        }, 500);
      }
    }
  },

  resetQuiz: () => {
    set({
      answers: {},
      showResults: false,
      isCompleted: false
    });
  },

  showResultsNow: () => {
    set({ showResults: true });
  },

  hideResults: () => {
    set({ showResults: false });
  },
  reset: () => {
    set(store.getInitialState());
  }
}));

// Selectors for computed values
export const useQuizProgress = () => {
  const answers = useQuizStore((state) => state.answers);
  const currentQuiz = useQuizStore((state) => state.currentQuiz);

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = currentQuiz?.length || 0;
  return totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
};

export const useQuizScore = () => {
  const answers = useQuizStore((state) => state.answers);
  const currentQuiz = useQuizStore((state) => state.currentQuiz) || [];

  return calculateQuizScore(answers, currentQuiz);
};

// Re-export utilities for convenience
export { getQuizScoreMessage, getQuizScoreColor };
