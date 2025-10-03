"use client";
import { QuestionType } from "@/queries/home-page";
import { useState } from "react";

function QuestionCard({ q, index }: { q: QuestionType; index: number }) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="p-5 rounded-xl border border-gray-200 shadow-sm max-w-4xl">
      <h2 className="font-semibold mb-3">
        {index + 1}. {q.text}
      </h2>
      <div className="space-y-2">
        {q.options.map((opt: string, i: number) => {
          const isSelected = selected === i;
          const isCorrect = i === q.correctIndex;

          let bg = "bg-white hover:bg-gray-50";
          if (selected !== null) {
            if (isSelected && isCorrect) bg = "bg-green-100 border-green-500";
            else if (isSelected && !isCorrect) bg = "bg-red-100 border-red-500";
            else if (isCorrect) bg = "bg-green-50 border-green-400";
          }

          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full text-left px-4 py-2 rounded-lg border ${bg} transition`}
              disabled={selected !== null}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Show explanation if available */}
      {selected !== null && q.explanation && <p className="mt-3 text-sm text-gray-600 italic">{q.explanation}</p>}
    </div>
  );
}

export default QuestionCard;
