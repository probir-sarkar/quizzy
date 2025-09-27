"use client";
import { Trophy } from "lucide-react";
import { motion } from "motion/react";
const HeroSection = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 opacity-90" />
    
      <div className="relative px-4 py-16 text-center text-white">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Trophy className="w-10 h-10" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold mb-3"
        >
          Challenge Yourself
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-white/90 mb-6"
        >
          Test your knowledge across various topics
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 justify-center"
        >
          <div className="text-center">
            <div className="text-2xl font-bold">25K+</div>
            <div className="text-sm text-white/80">Active Users</div>
          </div>
          <div className="w-px bg-white/20" />
          <div className="text-center">
            <div className="text-2xl font-bold">500+</div>
            <div className="text-sm text-white/80">Quizzes</div>
          </div>
          <div className="w-px bg-white/20" />
          <div className="text-center">
            <div className="text-2xl font-bold">98%</div>
            <div className="text-sm text-white/80">Satisfaction</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
