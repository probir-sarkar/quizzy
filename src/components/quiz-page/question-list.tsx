"use client";

import { motion } from "framer-motion";
import { QuestionType } from "@/queries/home-page";
import { useEffect } from "react";
import { useQuizStore } from "@/stores/quiz-store";
import QuizProgressBar from "./progress-bar";
import QuizResults from "./quiz-results";

export default function QuizQuestions({ questions }: { questions: QuestionType[] }) {
  const setCurrentQuiz = useQuizStore((state) => state.setCurrentQuiz);
  const answers = useQuizStore((state) => state.answers);
  const showResults = useQuizStore((state) => state.showResults);
  const setAnswer = useQuizStore((state) => state.setAnswer);
  const reset = useQuizStore((state) => state.reset);

  const sortedQuestions = questions.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  useEffect(() => {
    setCurrentQuiz(sortedQuestions);
  }, [sortedQuestions, setCurrentQuiz]);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div id="questions" className="mx-auto max-w-7xl pb-32">
      {/* Sticky Progress Bar */}
      <QuizProgressBar />

      {/* Header */}
      <motion.div className="px-6 py-10" variants={containerVariants} initial="hidden" animate="visible">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2"
          variants={itemVariants}
        >
          Quiz Questions
        </motion.h2>
        <motion.p className="text-gray-600 dark:text-gray-300" variants={itemVariants}>
          Answer all questions below and test your knowledge.
        </motion.p>
      </motion.div>

      {/* Questions List */}
      <motion.ol
        className="max-w-4xl pl-4 sm:pl-7 pr-4 sm:pr-6 space-y-6 sm:space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sortedQuestions.map((q, i) => (
          <motion.li id={`question-${i + 1}`} key={q.id} variants={itemVariants} transition={{ duration: 0.3 }}>
            <QuestionCard q={q} index={i} selected={answers[i]} onAnswer={setAnswer} showResult={showResults} />
          </motion.li>
        ))}
      </motion.ol>

      {/* Bottom Results Section */}
      <QuizResults />
    </div>
  );
}

function QuestionCard({
  q,
  index,
  selected,
  onAnswer,
  showResult
}: {
  q: QuestionType;
  index: number;
  selected?: number;
  onAnswer?: (questionIndex: number, answerIndex: number) => void;
  showResult?: boolean;
}) {
  const isAnswered = selected !== undefined && selected !== null;
  const isDisabled = isAnswered || !!showResult;

  const handleSelect = (answerIndex: number) => {
    if (!isDisabled && onAnswer) {
      onAnswer(index, answerIndex);
    }
  };

  return (
    <motion.div
      className="relative rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm p-4 sm:p-5 md:p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
    >
      {/* number chip */}
      <motion.div
        className="absolute -left-3 -top-3 select-none"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      >
        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900 text-sm font-semibold shadow">
          {index + 1}
        </span>
      </motion.div>

      {/* question text */}
      <motion.h2
        className="mb-3 sm:mb-4 pr-2 text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        {q.text}
      </motion.h2>

      {/* options */}
      <fieldset className="space-y-2">
        <legend className="sr-only">Question {index + 1}</legend>

        {q.options.map((opt, i) => {
          const isPicked = selected === i;
          const isCorrect = i === q.correctIndex;
          const answered = isAnswered || !!showResult;

          // base (light + dark)
          let cls =
            "w-full text-left px-3 sm:px-4 py-2.5 rounded-lg border transition-all duration-200 shadow-sm " +
            "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 " +
            "border-gray-200 dark:border-gray-700 " +
            "hover:bg-gray-50 dark:hover:bg-white/5 " +
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 dark:focus-visible:ring-white/20 " +
            (isDisabled ? "cursor-not-allowed" : "cursor-pointer hover:shadow-md");

          if (answered) {
            if (isPicked && isCorrect) {
              cls =
                "w-full text-left px-3 sm:px-4 py-2.5 rounded-lg border shadow-sm transition-all duration-200 " +
                "bg-green-50 dark:bg-green-900/30 border-green-500 " +
                "text-green-900 dark:text-green-100";
            } else if (isPicked && !isCorrect) {
              cls =
                "w-full text-left px-3 sm:px-4 py-2.5 rounded-lg border shadow-sm transition-all duration-200 " +
                "bg-red-50 dark:bg-red-900/30 border-red-500 " +
                "text-red-900 dark:text-red-100";
            } else if (isCorrect) {
              cls =
                "w-full text-left px-3 sm:px-4 py-2.5 rounded-lg border shadow-sm transition-all duration-200 " +
                "bg-green-50/70 dark:bg-green-900/20 border-green-400 " +
                "text-green-900/90 dark:text-green-200";
            } else {
              cls =
                "w-full text-left px-3 sm:px-4 py-2.5 rounded-lg border shadow-sm transition-all duration-200 " +
                "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 " +
                "border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed";
            }
          }

          // decorative radio dot (light + dark states)
          const dotBase = "inline-block h-4 w-4 rounded-full border transition-all duration-200";
          const dotClass = answered
            ? isPicked
              ? isCorrect
                ? "border-green-600 bg-green-600"
                : "border-red-600 bg-red-600"
              : isCorrect
              ? "border-green-500 bg-green-500"
              : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900"
            : isPicked
            ? "border-gray-900 bg-gray-900 dark:border-gray-100 dark:bg-gray-100"
            : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900";

          return (
            <motion.button
              key={i}
              type="button"
              className={cls}
              onClick={() => handleSelect(i)}
              disabled={isDisabled}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.03 }}
              whileHover={!isDisabled ? { scale: 1.02, x: 5 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
            >
              <span className="inline-flex items-center gap-3">
                <motion.span
                  className={`${dotBase} ${dotClass} shrink-0`}
                  animate={answered ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                />
                <span>{opt}</span>
              </span>
            </motion.button>
          );
        })}
      </fieldset>

      {/* explanation */}
      {isAnswered && q.explanation && (
        <motion.div
          className="mt-3 sm:mt-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-white/5 px-3 sm:px-4 py-3 text-sm text-gray-700 dark:text-gray-200"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
          <div className="flex items-start gap-2">
            <motion.svg
              className="w-4 h-4 mt-0.5 text-blue-500 dark:text-blue-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </motion.svg>
            <span>{q.explanation}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
