"use client";
import { useReducer, useMemo } from "react";
import { Info, Trophy, RotateCcw } from "lucide-react";
import { QuestionType } from "@/modules/quiz/quiz.service";
import { calculateQuizScore, getQuizScoreMessage, getQuizScoreColor } from "@/lib/quiz-utils";
import { cn } from "@/lib/utils";
import { AnswerButton } from "./quiz-answer-button";

type AnswersState = Record<number, number>;

type QuizAction =
  | { type: "SET_ANSWER"; questionIndex: number; answerIndex: number }
  | { type: "RESET" };

function quizReducer(state: AnswersState, action: QuizAction): AnswersState {
  switch (action.type) {
    case "SET_ANSWER": {
      const { questionIndex, answerIndex } = action;
      if (state[questionIndex] === answerIndex) return state;
      return { ...state, [questionIndex]: answerIndex };
    }
    case "RESET":
      return {};
    default:
      return state;
  }
}

export default function QuizQuestions({ questions }: { questions: QuestionType[] }) {
  const [answers, dispatch] = useReducer(quizReducer, {});

  const score = useMemo(() => calculateQuizScore(answers, questions), [answers, questions]);
  const { correct, percentage } = score;

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);
  const isComplete = answeredCount === totalQuestions;

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    dispatch({ type: "SET_ANSWER", questionIndex, answerIndex });
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
  };

  return (
    <div id="questions" className="mx-auto max-w-7xl pb-8">


      <div className="px-4 sm:px-6 py-6 md:py-10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Quiz Questions</h2>
        <p className="text-gray-600 dark:text-gray-300">Answer all questions below and test your knowledge.</p>
      </div>
      <ol className="max-w-4xl pl-4 sm:pl-7 pr-4 sm:pr-6 space-y-5 sm:space-y-6">
        {questions.map((q, i) => (
          <li key={q.id}>
            <QuestionCard
              q={q}
              index={i}
              selected={answers[i]}
              onAnswer={handleAnswer}
              totalQuestions={totalQuestions}
            />
          </li>
        ))}
      </ol>

      {/* Progress bar after last question - transforms to results when complete */}
      <div className="max-w-4xl mx-auto pl-4 sm:pl-7 pr-4 sm:pr-6 mt-5 sm:mt-6">
        {isComplete ? (
          // Results display when complete
          <div className="rounded-2xl border border-white/10 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] p-5 sm:p-6 space-y-4">
            <div className="text-center">
              <Trophy className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Quiz Complete!</h3>
              <p className={cn("text-sm font-medium", getQuizScoreColor(percentage))}>
                {getQuizScoreMessage(percentage)}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700/30">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{correct}</div>
                <div className="text-xs text-green-600 dark:text-green-400">Correct</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-700/30">
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">{totalQuestions - correct}</div>
                <div className="text-xs text-red-600 dark:text-red-400">Incorrect</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{percentage}%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Score</div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : (
          // Progress bar when in progress
          <div className="rounded-2xl border border-white/10 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-violet-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Progress</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{progress}%</span>
            </div>
            <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out bg-linear-to-r from-violet-500 to-fuchsia-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionCard({
  q,
  index,
  selected,
  onAnswer,
  totalQuestions
}: {
  q: QuestionType;
  index: number;
  selected?: number;
  onAnswer?: (questionIndex: number, answerIndex: number) => void;
  totalQuestions: number;
}) {
  const isAnswered = selected !== undefined && selected !== null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
          Question {index + 1} of {totalQuestions}
        </span>
      </div>

      <h2 className="text-base sm:text-lg font-medium text-slate-900 dark:text-white mb-3 sm:mb-4 leading-snug wrap-break-word">
        {q.text}
      </h2>

      <fieldset className="space-y-2">
        <legend className="sr-only">Question {index + 1}</legend>
        {q.options.map((opt, i) => (
          <AnswerButton
            key={`${q.id}-${opt}`}
            text={opt}
            isPicked={selected === i}
            isCorrect={i === q.correctIndex}
            answered={isAnswered}
            disabled={isAnswered}
            onClick={() => !isAnswered && onAnswer?.(index, i)}
          />
        ))}
      </fieldset>

      {isAnswered && q.explanation && (
        <div className="mt-3 sm:mt-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-white/5 px-3 sm:px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 text-blue-500 dark:text-blue-400 shrink-0" />
            <span>{q.explanation}</span>
          </div>
        </div>
      )}
    </div>
  );
}
