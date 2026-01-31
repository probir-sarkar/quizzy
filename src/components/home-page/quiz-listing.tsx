"use client";

import { motion } from "motion/react";
import { Bookmark, Target, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ShineBorder } from "../ui/shine-border";
import { useTheme } from "next-themes";
import { QuizCard as QuizCardType } from "@/queries/home-page";
import Link from "next/link";

// ---- Types ----
type Difficulty = "easy" | "medium" | "hard";

const gradients = [
  "from-violet-500 to-fuchsia-600",
  "from-blue-500 to-cyan-600",
  "from-green-500 to-emerald-600",
  "from-yellow-500 to-amber-600",
  "from-red-500 to-rose-600",
  "from-pink-500 to-fuchsia-600"
];
export function getGradient(index: number) {
  return gradients[index % gradients.length];
}

// ---- Listing ----
export default function QuizListing({ quizzes }: { quizzes: QuizCardType[] }) {
  return (
    <div className="px-4 my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 container mx-auto">
      {quizzes.map((quiz, i) => (
        <QuizCard key={quiz.id} quiz={quiz} delay={i * 0.1} index={i} />
      ))}
    </div>
  );
}

// ---- Card ----
export function QuizCard({ quiz, delay = 0, index }: { quiz: QuizCardType; delay?: number; index: number }) {
  const { resolvedTheme } = useTheme();

  // 🎨 Colorful shine colors
  const lightShineColors = [
    "#FF6B6B", // red-pink
    "#FFD93D", // yellow
    "#6BCB77", // green
    "#4D96FF", // blue
    "#9D4EDD" // purple
  ];

  const darkShineColors = [
    "#FF9F1C", // orange
    "#2EC4B6", // teal
    "#E71D36", // red
    "#FFBF69", // peach
    "#A29BFE" // soft purple
  ];

  const shineColors = resolvedTheme === "dark" ? darkShineColors : lightShineColors;

  return (
    <Link href={`/quiz/${quiz.slug}`} className="w-full h-full block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="w-full h-full"
      >
        <Card className="group pt-0 gap-0 pb-2 relative w-full h-full overflow-hidden cursor-pointer border-0 bg-white dark:bg-gray-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <ShineBorder
            shineColor={shineColors}
            borderWidth={1.5}
            duration={10}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />

          {/* Top gradient banner */}
          <CardHeader
            className={`xl:aspect-video aspect-16/7 bg-linear-to-br ${getGradient(index)} relative overflow-hidden p-0`}
          >
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent p-4 sm:p-6 flex items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/90 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                {quiz.category?.name}
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <DifficultyBadge difficulty={quiz.difficulty} />
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter flex items-center gap-1">
                <Target className="w-3 h-3" />
                {quiz._count.questions} Qs
              </span>
            </div>

            <h3 className="font-bold text-lg sm:text-xl mb-2 text-gray-900 dark:text-white group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
              {quiz.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-0 leading-snug">
              {quiz.description}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

// ---- Difficulty Badge ----
export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const map: Record<Difficulty, string> = {
    easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    hard: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
  };
  return (
    <span className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded-full ${map[difficulty]}`}>
      {difficulty}
    </span>
  );
}
