"use client";
import { Trophy, Sparkles, BookOpen, Layers } from "lucide-react";
import { motion } from "motion/react";

interface HeroSectionProps {
  totalQuizzes?: number;
  totalCategories?: number;
  totalSubCategories?: number;
}

const HeroSection = ({ totalQuizzes = 0, totalCategories = 0, totalSubCategories = 0 }: HeroSectionProps) => {
  return (
    <div className="relative min-h-[500px] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Dynamic Background Layers */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-fuchsia-600/20 blur-[120px] animate-pulse [animation-delay:2s]" />
        <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px] animate-pulse [animation-delay:4s]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            <span className="text-sm font-medium text-fuchsia-200/80">Ultimate Quiz Experience</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight"
          >
            Master Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
              Knowledge
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Explore thousands of curated quizzes. Challenge yourself across diverse topics and track your journey to
            mastery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            <StatCard
              icon={<Layers className="w-5 h-5 text-violet-400" />}
              label="Categories"
              value={`${totalCategories}+`}
              delay={0.4}
            />
            <StatCard
              icon={<BookOpen className="w-5 h-5 text-fuchsia-400" />}
              label="Sub-topics"
              value={`${totalSubCategories}+`}
              delay={0.5}
            />
            <StatCard
              icon={<Trophy className="w-5 h-5 text-amber-400" />}
              label="Quizzes"
              value={`${totalQuizzes}+`}
              delay={0.6}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  delay
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative flex flex-col items-center gap-3 text-center">
      <div className="p-2.5 rounded-xl bg-slate-900/50 border border-white/5 shadow-inner">{icon}</div>
      <div>
        <div className="text-2xl font-bold text-white mb-0.5 tracking-tight">{value}</div>
        <div className="text-xs font-medium text-slate-400 uppercase tracking-widest">{label}</div>
      </div>
    </div>
  </motion.div>
);

export default HeroSection;
