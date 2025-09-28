"use client";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const Navbar = () => {
  return (
    <nav
      className={cn(
        `sticky top-0 z-50 glass border-b  dark:border-gray-800 border-gray-200`,
        "bg-white/20 border border-white/30 backdrop-blur-md  dark:bg-white/5 dark:border-white/10 "
      )}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <motion.div className="flex items-center gap-2 cursor-pointer" whileTap={{ scale: 0.96 }}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className={`font-bold text-lg  dark:text-white text-gray-900`}>QuizMaster</span>
        </motion.div>

        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
