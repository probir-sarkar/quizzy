"use client";

import { QuestionType } from "@/queries/home-page";
import { useState } from "react";

export default function QuizQuestions({ questions }: { questions: QuestionType[] }) {
  return (
    <div id="questions" className="mx-auto max-w-7xl">
         <div className="px-6 pt-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Quiz Questions
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Answer all questions below and test your knowledge.
        </p>
      </div>
      <ol className=" max-w-4xl px-4 md:px-6 py-10 space-y-8">
        {questions
          .slice()
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((q, i) => (
            <li id={`question-${i}`} key={q.id}>
              <QuestionCard q={q} index={i} />
            </li>
          ))}
      </ol>
    </div>
  );
}

function QuestionCard({ q, index }: { q: QuestionType; index: number }) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="relative rounded-2xl border border-gray-200/70 bg-white shadow-sm p-5 md:p-6">
      {/* number chip */}
      <div className="absolute -left-3 -top-3 select-none">
        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-semibold shadow">
          {index + 1}
        </span>
      </div>

      {/* question text */}
      <h2 className="mb-4 pr-2 text-base md:text-lg font-semibold text-gray-900 leading-relaxed">{q.text}</h2>

      {/* options */}
      <fieldset className="space-y-2">
        <legend className="sr-only">Question {index + 1}</legend>

        {q.options.map((opt, i) => {
          const isPicked = selected === i;
          const isCorrect = i === q.correctIndex;
          const answered = selected !== null;

          // 🎨 purely visual styles
          let cls =
            "w-full text-left px-4 py-2.5 rounded-lg border bg-white hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 transition shadow-sm";
          if (answered) {
            if (isPicked && isCorrect)
              cls =
                "w-full text-left px-4 py-2.5 rounded-lg border bg-green-50 border-green-500 text-green-900 shadow-sm";
            else if (isPicked && !isCorrect)
              cls = "w-full text-left px-4 py-2.5 rounded-lg border bg-red-50 border-red-500 text-red-900 shadow-sm";
            else if (isCorrect)
              cls =
                "w-full text-left px-4 py-2.5 rounded-lg border bg-green-50/70 border-green-400 text-green-900/90 shadow-sm";
            else
              cls =
                "w-full text-left px-4 py-2.5 rounded-lg border bg-white text-gray-500 border-gray-200 opacity-75 cursor-not-allowed";
          }

          return (
            <button key={i} type="button" className={cls} onClick={() => setSelected(i)} disabled={answered}>
              <span className="inline-flex items-center gap-3">
                {/* custom radio dot purely decorative */}
                <span
                  className={[
                    "inline-block h-4 w-4 rounded-full border",
                    answered
                      ? isPicked
                        ? isCorrect
                          ? "border-green-600 bg-green-600"
                          : "border-red-600 bg-red-600"
                        : isCorrect
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300 bg-white"
                      : isPicked
                      ? "border-gray-900 bg-gray-900"
                      : "border-gray-300 bg-white"
                  ].join(" ")}
                />
                <span>{opt}</span>
              </span>
            </button>
          );
        })}
      </fieldset>

      {/* explanation */}
      {selected !== null && q.explanation && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          {q.explanation}
        </div>
      )}
    </div>
  );
}
