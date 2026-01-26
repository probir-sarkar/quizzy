"use client";

import { motion } from "motion/react";
import { TrendingUp, ArrowRight } from "lucide-react";
import { QuizCard } from "@/queries/home-page";
import Link from "next/link";
import { Card } from "../ui/card";
import { getGradient } from "./quiz-listing";

interface TrendingSectionProps {
  quizzes: QuizCard[];
}

export default function TrendingSection({ quizzes }: TrendingSectionProps) {
  if (!quizzes || quizzes.length === 0) return null;

  return (
    <section className="container mx-auto px-4 mt-20">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Trending Now</h2>
        </div>
        <Link
          href="/quiz"
          className="text-sm font-bold text-violet-500 flex items-center gap-1 hover:gap-2 transition-all"
        >
          Explore All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar mask-fade-right">
        {quizzes.map((quiz, i) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="min-w-[300px] sm:min-w-[350px]"
          >
            <Link href={`/quiz/${quiz.slug}`}>
              <Card className="group relative h-48 rounded-[2rem] border-0 overflow-hidden shadow-2xl">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getGradient(i)} opacity-90 group-hover:scale-110 transition-transform duration-500`}
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />

                <div className="relative h-full p-6 flex flex-col justify-between text-white">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      {quiz.category?.name}
                    </span>
                    <h3 className="text-lg font-black mt-4 leading-tight group-hover:translate-x-1 transition-transform line-clamp-2">
                      {quiz.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium opacity-80">{quiz._count.questions} questions</span>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-slate-900 transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
