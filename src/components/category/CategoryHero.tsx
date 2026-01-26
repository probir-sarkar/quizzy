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
    <section className={`relative ${gradient} text-white overflow-hidden`}>
      {/* Decorative layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/15" />
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white/5 blur-3xl" />

      <div className="relative container mx-auto px-6 pt-32 pb-14">
        {/* Home button in corner */}
        <div className="mb-8">
          <Link
            href="/category"
            className="inline-flex items-center gap-2 rounded-full bg-white/20 hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 backdrop-blur-sm px-3 py-1.5 text-sm font-medium transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        {/* Left aligned content */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-6 h-6 opacity-90" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{category.name}</h1>
          </div>

          <p className="text-white/90 text-base md:text-lg leading-relaxed mb-6 max-w-2xl">{description}</p>

          <div className="flex flex-wrap gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm font-medium">
              <span className="text-white font-semibold">{category.quizCount}</span>
              <span className="text-white/80">Quizzes</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm font-medium">
              <span className="text-white font-semibold">{category.subCategryCount}</span>
              <span className="text-white/80">Subcategories</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
