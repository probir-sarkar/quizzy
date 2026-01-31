"use client";

import Link from "next/link";
import { Sparkles, ChevronLeft } from "lucide-react";
import React, { useMemo } from "react";

export type CategoryPageType = {
  name: string;
  slug: string;
  quizCount: number;
  subCategryCount: number;
};

function pickGradient(slug?: string) {
  const gradients = [
    "bg-gradient-to-r from-emerald-500 to-teal-600",
    "bg-gradient-to-r from-amber-500 to-orange-600",
    "bg-gradient-to-r from-rose-500 to-fuchsia-600",
    "bg-gradient-to-r from-indigo-500 to-purple-600",
    "bg-gradient-to-r from-sky-500 to-blue-600",
    "bg-gradient-to-r from-lime-500 to-emerald-600"
  ];
  if (!slug) return gradients[0];
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h << 5) - h + slug.charCodeAt(i);
  const idx = Math.abs(h) % gradients.length;
  return gradients[idx];
}

export default function CategoryHero({ category }: { category: CategoryPageType }) {
  const gradient = useMemo(() => pickGradient(category.slug), [category.slug]);
  if (!category) return null;

  const description = `Explore quizzes in ${category.name}. Find popular quizzes, filter by difficulty, and challenge yourself!`;

  return (
    <section className="relative overflow-hidden bg-slate-950 pt-24 pb-12 md:pt-32 md:pb-20">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-1/2 -right-1/4 w-[70%] h-[70%] rounded-full opacity-20 blur-[120px] animate-pulse ${gradient}`}
        />
        <div
          className={`absolute -bottom-1/2 -left-1/4 w-[70%] h-[70%] rounded-full opacity-10 blur-[120px] animate-pulse [animation-delay:2s] ${gradient}`}
        />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6">
        {/* Back button */}
        <div className="mb-6 md:mb-8">
          <Link
            href="/category"
            className="inline-flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Categories
          </Link>
        </div>

        {/* Content */}
        <div className="max-w-3xl w-full">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Sparkles className={`w-5 h-5 md:w-6 md:h-6 text-white`} />
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white break-words">{category.name}</h1>
          </div>

          <p className="text-slate-400 text-base md:text-xl leading-relaxed mb-8 max-w-2xl break-words">
            {description}
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-2">
              <span className={`font-bold text-lg text-white`}>{category.quizCount}</span>
              <span className="text-slate-400 text-sm font-medium">Quizzes</span>
            </div>

            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-2">
              <span className={`font-bold text-lg text-white`}>{category.subCategryCount}</span>
              <span className="text-slate-400 text-sm font-medium">Subcategories</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
