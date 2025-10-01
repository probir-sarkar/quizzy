"use client";

import { motion } from "motion/react";
import { Bookmark, Target, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ShineBorder } from "../ui/shine-border";
import { useTheme } from "next-themes";
import { QuizCard as QuizCardType } from "@/queries/home-page";

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
 function getGradient(index: number) {
  return gradients[index % gradients.length];
}

// ---- Listing ----
export default function QuizListing({ quizzes }: { quizzes: QuizCardType[] }) {
  return (
    <div className="px-4 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 container mx-auto">
      {quizzes.map((quiz, i) => (
        <QuizCard key={quiz.id} quiz={quiz} delay={i * 0.1} index={i} />
      ))}
    </div>
  );
}

// ---- Card ----
function QuizCard({ quiz, delay = 0, index }: { quiz: QuizCardType; delay?: number, index: number }) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="relative w-full h-full overflow-hidden cursor-pointer border bg-white dark:bg-gray-900 rounded-2xl shadow-lg pt-0">
        {/* Animated border overlay */}
        <ShineBorder shineColor={shineColors} borderWidth={2} duration={14} />

        {/* Top gradient banner */}
        <CardHeader className={`aspect-[3/1] bg-gradient-to-br ${getGradient(index)} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-3 right-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
              aria-label="Bookmark quiz"
            >
              <Bookmark className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </CardHeader>

        <CardContent className="">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {quiz.category?.name}
            </span>
            <DifficultyBadge difficulty={quiz.difficulty} />
          </div>

          <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{quiz.title}</h3>
          <p className="text-sm mb-3 text-gray-600 dark:text-gray-400">{quiz.description}</p>

          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              {quiz._count.questions} Questions
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {/* {quiz.plays} */}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ---- Difficulty Badge ----
function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
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
