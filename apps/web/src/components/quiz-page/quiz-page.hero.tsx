"use client";

import { Sparkles, ChevronLeft } from "lucide-react";
import { QuizPageType } from "@/queries/home-page";
import { useCallback } from "react";
import Link from "next/link";
import { QuizDifficulty } from "@quizzy/prisma/enums";

export default function QuizHero({ quiz }: { quiz: QuizPageType }) {
  if (!quiz) return null;

  // Difficulty → gradient background
  const gradient =
    quiz.difficulty === QuizDifficulty.easy
      ? "bg-gradient-to-r from-emerald-500 to-teal-600"
      : quiz.difficulty === QuizDifficulty.medium
      ? "bg-gradient-to-r from-amber-500 to-orange-600"
      : quiz.difficulty === QuizDifficulty.hard
      ? "bg-gradient-to-r from-rose-500 to-fuchsia-600"
      : "bg-gradient-to-r from-indigo-500 to-purple-600";

  // Difficulty → chip color
  const difficultyStyle =
    quiz.difficulty === QuizDifficulty.easy
      ? "bg-emerald-100/20 text-emerald-100 border-emerald-200"
      : quiz.difficulty === QuizDifficulty.medium
      ? "bg-amber-100/20 text-amber-100 border-amber-200"
      : quiz.difficulty === QuizDifficulty.hard
      ? "bg-rose-100/20 text-rose-100 border-rose-200"
      : "bg-indigo-100/20 text-indigo-100 border-indigo-200";

  return (
    <div className={`relative ${gradient} text-white overflow-hidden`}>
      {/* Subtle contrast overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />

      {/* Decorative blur blobs (very light) */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-14">
        {/* Top bar: Back pill */}
        <div className="mb-6">
          <Link
            href={ `/category/${quiz.category?.slug}` }
            className="inline-flex items-center gap-2 rounded-full bg-white/20 hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 backdrop-blur-sm px-3 py-1.5 text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          {/* Left: Title + Info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-5">
              <h1 className="text-3xl md:text-4xl font-bold leading-snug tracking-tight">{quiz.title}</h1>
            </div>

            <p className="max-w-2xl text-white/85 text-base md:text-lg mb-6 leading-relaxed">
              {quiz.description ?? "Put your knowledge to the test with these fun and tricky questions!"}
            </p>

            {/* Tags */}
            {quiz.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-7">
                {quiz.tags.map((tag) => (
                  <span
                    key={tag.tagId}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-colors capitalize"
                  >
                    {tag.tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Difficulty */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border ${difficultyStyle} font-medium text-base shadow-sm`}
            >
              <span>Difficulty:</span>
              <span className="font-semibold">{quiz.difficulty.toUpperCase()}</span>
            </div>
          </div>

          {/* Right: Stats + Start */}
          <div className="flex-1 flex justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/15 max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">Quiz Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-white/80 text-sm">Questions</span>
                  <span className="font-bold text-lg">{quiz._count.questions}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-white/80 text-sm">Category</span>
                  <span className="font-bold text-lg">{quiz.category?.name || "General"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Difficulty</span>
                  <span className="font-bold text-lg">{quiz.difficulty.toUpperCase()}</span>
                </div>
              </div>

              <Link
                href={`#questions`}
                // onClick={handleStart}
                className="block text-center mt-6 w-full py-2.5 bg-white text-gray-900 font-semibold rounded-lg hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 transition"
              >
                Start Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
