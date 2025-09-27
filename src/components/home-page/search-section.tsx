"use client";
import { Search, Filter } from "lucide-react";
import { motion } from "motion/react";

const SearchSection = () => {
  return (
    <div className="px-4 -mt-6 relative z-10 container mx-auto">
      <div className="   bg-white/20 border border-white/30 backdrop-blur-md rounded-2xl dark:bg-white/5 dark:border-white/10  p-4 shadow-xl">
        <div className="flex gap-2">
          {/* Search Box */}
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-800">
            <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search quizzes..."
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          {/* Filter Button */}
          <motion.button whileTap={{ scale: 0.9 }} className="p-3 rounded-xl bg-white dark:bg-gray-800">
            <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
