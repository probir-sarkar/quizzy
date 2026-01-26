"use client";

import { Sparkles, Target, Layers, Trophy } from "lucide-react";
import { QuizPageType } from "@/queries/home-page";
import { QuizDifficulty } from "@/generated/prisma/enums";
import { motion } from "motion/react";

export default function QuizHero({ quiz }: { quiz: QuizPageType }) {
  if (!quiz) return null;

  const difficultyColors = {
    [QuizDifficulty.easy]: "from-emerald-400 to-teal-500",
    [QuizDifficulty.medium]: "from-amber-400 to-orange-500",
    [QuizDifficulty.hard]: "from-rose-400 to-fuchsia-500"
  };

  const bgColor = difficultyColors[quiz.difficulty as QuizDifficulty] || "from-violet-400 to-fuchsia-500";

  return (
    <div className="relative overflow-hidden bg-slate-950 py-12 md:py-20">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-1/2 -right-1/4 w-[70%] h-[70%] rounded-full bg-gradient-to-br ${bgColor} opacity-20 blur-[120px] animate-pulse`}
        />
        <div
          className={`absolute -bottom-1/2 -left-1/4 w-[70%] h-[70%] rounded-full bg-gradient-to-br ${bgColor} opacity-10 blur-[120px] animate-pulse [animation-delay:2s]`}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Side */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6`}
            >
              <Sparkles className={`w-4 h-4 text-transparent bg-clip-text bg-gradient-to-r ${bgColor} bg-white`} />
              <span className="text-xs font-bold tracking-widest text-white/80 uppercase">
                {quiz.category?.name || "General"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight"
            >
              {quiz.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-400 max-w-2xl mb-8 leading-relaxed"
            >
              {quiz.description || "Challenge yourself with this expertly curated quiz and see how you rank!"}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center lg:justify-start gap-3"
            >
              {quiz.tags.map((tag, i) => (
                <span
                  key={tag.tagId}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-slate-300 backdrop-blur-sm"
                >
                  #{tag.tag.name}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right Side: Stats Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="w-full max-w-md"
          >
            <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-white/0 border border-white/10 backdrop-blur-2xl overflow-hidden shadow-2xl">
              <div className="bg-slate-900/50 rounded-[2.3rem] p-8">
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Quiz Intelligence
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/20">
                        <Target className="w-5 h-5 text-violet-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">Total Questions</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{quiz._count.questions}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10`}
                      >
                        <Layers
                          className={`w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r ${bgColor} bg-white`}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-300">Difficulty Level</span>
                    </div>
                    <span
                      className={`text-sm font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r ${bgColor} bg-white`}
                    >
                      {quiz.difficulty}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => document.getElementById("questions")?.scrollIntoView({ behavior: "smooth" })}
                  className={`w-full mt-10 py-4 rounded-2xl bg-gradient-to-r ${bgColor} text-white font-bold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all text-sm uppercase tracking-widest`}
                >
                  Begin Knowledge Quest
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
