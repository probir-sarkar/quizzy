"use client";

import { motion } from "framer-motion";
import { Bookmark, Target, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ShineBorder } from "../ui/shine-border";
import { useTheme } from "next-themes";

// ---- Types ----
type Difficulty = "easy" | "medium" | "hard";
type Quiz = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  gradient: string; // e.g. "from-violet-500 to-fuchsia-600"
  questions: number;
  plays: string; // "12.5K"
};

// ---- Mock Data ----
const quizzes: Quiz[] = [
  {
    id: "1",
    slug: "javascript-fundamentals",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of core JavaScript concepts",
    category: "Programming",
    difficulty: "medium",
    gradient: "from-violet-500 to-fuchsia-600",
    questions: 10,
    plays: "12.5K"
  },
  {
    id: "2",
    slug: "world-capitals",
    title: "World Capitals Challenge",
    description: "How well do you know world geography?",
    category: "Geography",
    difficulty: "easy",
    gradient: "from-blue-500 to-cyan-600",
    questions: 15,
    plays: "8.2K"
  },
  {
    id: "3",
    slug: "science-trivia",
    title: "Science Trivia Master",
    description: "Advanced science questions for experts",
    category: "Science",
    difficulty: "hard",
    gradient: "from-green-500 to-emerald-600",
    questions: 20,
    plays: "5.8K"
  },
  {
    id: "4",
    slug: "movie-buffs",
    title: "Cinema Classics Quiz",
    description: "Test your film knowledge",
    category: "Movies",
    difficulty: "medium",
    gradient: "from-orange-500 to-red-600",
    questions: 12,
    plays: "15.1K"
  }
];

// ---- Listing ----
export default function QuizListing({ onSelectQuiz }: { onSelectQuiz?: (q: Quiz) => void }) {
  return (
    <div className="px-4 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 container mx-auto">
      {quizzes.map((quiz, i) => (
        <QuizCard key={quiz.id} quiz={quiz} delay={i * 0.1} onSelect={(q) => onSelectQuiz?.(q)} />
      ))}
    </div>
  );
}

// ---- Card ----
function QuizCard({ quiz, onSelect, delay = 0 }: { quiz: Quiz; onSelect?: (q: Quiz) => void; delay?: number }) {
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
      onClick={() => onSelect?.(quiz)}
    >
      <Card className="relative w-full h-full overflow-hidden cursor-pointer border bg-white dark:bg-gray-900 rounded-2xl shadow-lg pt-0">
        {/* Animated border overlay */}
        <ShineBorder shineColor={shineColors} borderWidth={2} duration={14} />

        {/* Top gradient banner */}
        <CardHeader className={`aspect-[3/1] bg-gradient-to-br ${quiz.gradient} relative overflow-hidden`}>
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
              {quiz.category}
            </span>
            <DifficultyBadge difficulty={quiz.difficulty} />
          </div>

          <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{quiz.title}</h3>
          <p className="text-sm mb-3 text-gray-600 dark:text-gray-400">{quiz.description}</p>

          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              {quiz.questions} Questions
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {quiz.plays}
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
