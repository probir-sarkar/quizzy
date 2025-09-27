"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const categories = ["All", "Programming", "Science", "Geography", "Movies", "History"];

export default function CategoryFilters() {
  return (
    <div className="px-4 mt-6 container mx-auto">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <motion.div key={cat} whileTap={{ scale: 0.95 }}>
            <Badge
              className={`px-4 py-2 rounded-full cursor-pointer whitespace-nowrap transition-colors
                ${cat === "All"
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white shadow-lg hover:opacity-90"
                  : "bg-white text-gray-700 shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }
              `}
            >
              {cat}
            </Badge>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
