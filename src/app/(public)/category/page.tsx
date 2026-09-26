import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoryCountSection, CategoryCountSkeleton } from "./category-count";
import { CategoryListSection, CategoryListSkeleton } from "./category-list";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "All Quiz Categories - Quizzy",
  description:
    "Explore all quiz categories and test your knowledge across various topics. From science to pop culture, find quizzes that match your interests and challenge yourself."
};

export default async function CategoriesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="border-b-2 border-foreground">
        <div className="mx-auto max-w-[1400px] px-4 pt-28 pb-12 sm:px-6 md:pt-36">
          <Reveal y={12}>
            <Link
              href="/"
              prefetch
              className="group inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to home
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
              The full index
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-3 font-sans text-5xl font-black uppercase leading-[0.9] tracking-[-0.02em] sm:text-7xl lg:text-8xl">
              All <span className="border-b-8 border-lime-300">Categories</span>
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
              From science to pop culture — pick a shelf, start pulling books down. Every category keeps its own
              scoreboard.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="rule-dotted mt-8 pt-6">
              <Suspense fallback={<CategoryCountSkeleton />}>
                <CategoryCountSection />
              </Suspense>
            </div>
          </Reveal>
        </div>
      </section>

      <Suspense fallback={<CategoryListSkeleton />}>
        <CategoryListSection />
      </Suspense>
    </main>
  );
}
