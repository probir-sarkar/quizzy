"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Info, RotateCcw } from "lucide-react";
import { motion } from "motion/react";

import { calculateQuizScore, getQuizScoreMessage } from "@/lib/quiz-utils";
import { cn } from "@/lib/utils";
import { AnswerButton } from "./quiz-answer-button";
import { Reveal } from "@/components/motion/reveal";
import type { QuestionDto as QuestionType } from "@/server/quiz";

type AnswersState = Record<number, number>;

export default function QuizQuestions({ questions }: { questions: QuestionType[] }) {
  const [answers, setAnswers] = useState<AnswersState>({});

  const score = useMemo(() => calculateQuizScore(answers, questions), [answers, questions]);
  const { correct, percentage } = score;

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);
  const isComplete = answeredCount === totalQuestions;

  useEffect(() => {
    if (isComplete) {
      const resultsElement = document.getElementById("quiz-results");
      resultsElement?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isComplete]);

  const handleAnswer = useCallback((questionIndex: number, answerIndex: number) => {
    setAnswers((prev) => {
      if (prev[questionIndex] === answerIndex) return prev;
      return { ...prev, [questionIndex]: answerIndex };
    });
  }, []);

  const handleReset = useCallback(() => {
    setAnswers({});
    setTimeout(() => {
      const questionsElement = document.getElementById("questions");
      questionsElement?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  return (
    <div id="questions" className="mx-auto max-w-[1400px]">
      <div className="px-4 pt-12 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-sans text-3xl font-black uppercase tracking-tight sm:text-5xl">The Questions</h2>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
              {answeredCount} / {totalQuestions} answered
            </p>
          </div>
          <p className="mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
            Answer every one — the press will grade you at the end
          </p>
        </Reveal>
      </div>

      <ol className="max-w-5xl space-y-10 px-4 pt-10 sm:px-6">
        {questions.map((q, i) => (
          <li key={q.id}>
            <Reveal y={20}>
              <QuestionCard
                q={q}
                index={i}
                selected={answers[i]}
                onAnswer={handleAnswer}
                totalQuestions={totalQuestions}
              />
            </Reveal>
          </li>
        ))}
      </ol>

      {/* Results / progress — aligned with the question column */}
      <div id="quiz-results" className="max-w-5xl px-4 pt-10 sm:px-6">
        {isComplete ? (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="border-2 border-foreground bg-card shadow-pop [--pop:var(--pop-lime)] [--pop-x:8px] [--pop-y:8px]"
          >
            <div className="border-b-2 border-dotted border-foreground/40 px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
              Final verdict
            </div>
            <div className="p-6 text-center sm:p-10">
              <p className="font-sans text-7xl font-black tracking-tight tabular-nums sm:text-8xl">{percentage}%</p>
              <p className="mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                {getQuizScoreMessage(percentage)}
              </p>

              <div className="mx-auto mt-6 grid max-w-md grid-cols-2 divide-x-2 divide-dotted divide-foreground/40 border-2 border-foreground">
                <div className="p-4">
                  <div className="font-sans text-3xl font-black tabular-nums">{correct}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Right</div>
                </div>
                <div className="p-4">
                  <div className="font-sans text-3xl font-black tabular-nums">{totalQuestions - correct}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Wrong</div>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="pop-hover mt-8 inline-flex cursor-pointer items-center justify-center gap-2 border-2 border-foreground bg-foreground px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-background shadow-pop [--pop:var(--pop-violet)]"
              >
                <RotateCcw className="h-4 w-4" />
                Run It Back
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="sticky bottom-4 border-2 border-foreground bg-card p-5 shadow-pop [--pop:var(--pop-cyan)] [--pop-x:6px] [--pop-y:6px] sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Your progress
              </span>
              <span className="font-sans text-xl font-black tabular-nums">{progress}%</span>
            </div>
            <div className="h-4 w-full border-2 border-foreground">
              <div
                className="h-full bg-foreground transition-all duration-500 ease-out"
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
  const isAnswered = selected !== undefined;
  const number = String(index + 1).padStart(2, "0");

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
      {/* Giant index — exam-paper margin number */}
      <div className="flex items-start gap-3 md:col-span-2 md:flex-col md:items-start">
        <span
          className={cn(
            "font-sans text-5xl font-black leading-none tracking-tighter tabular-nums transition-colors duration-300 sm:text-6xl",
            isAnswered ? "text-foreground/25" : "text-foreground"
          )}
        >
          {number}
        </span>
        <span className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground md:mt-2">
          of {String(totalQuestions).padStart(2, "0")}
          {isAnswered && <span className="ml-2 text-foreground">✓ locked</span>}
        </span>
      </div>

      {/* Question body */}
      <article
        className={cn(
          "border-2 border-foreground bg-card md:col-span-10",
          !isAnswered && "shadow-pop [--pop:var(--pop-violet)]"
        )}
      >
        <div className="p-5 sm:p-7">
          <h3 className="font-sans text-xl font-black leading-snug wrap-break-word sm:text-2xl">{q.text}</h3>

          <fieldset className="mt-5 grid grid-cols-1 gap-2.5 lg:grid-cols-2">
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
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.35 }}
              className="mt-5 overflow-hidden"
            >
              <div className="border-2 border-dashed border-foreground/50 px-4 py-3 font-sans text-sm leading-relaxed text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{q.explanation}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </article>
    </div>
  );
}
