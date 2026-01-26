"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface CategoryFiltersProps {
  categories: { name: string; slug: string }[];
}

export default function CategoryFilters({ categories }: CategoryFiltersProps) {
  const badgeStyles = cn(
    "relative px-6 py-2.5 rounded-2xl whitespace-nowrap cursor-pointer transition-all duration-300",
    "text-sm font-semibold tracking-tight",
    "bg-white/5 border border-white/10 backdrop-blur-md",
    "text-slate-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10",
    "shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_30px_rgba(139,92,246,0.15)]"
  );

  return (
    <div className="px-4 mt-12 container mx-auto">
      <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar mask-fade-right">
        <Link href="/category" scroll={false}>
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={cn(badgeStyles, "bg-violet-600 text-white border-violet-500 shadow-violet-500/20")}
          >
            Explore All
          </motion.div>
        </Link>

        {categories.map((cat, i) => (
          <Link key={cat.slug} href={`/category/${cat.slug}`} prefetch>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={badgeStyles}
            >
              {cat.name}
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
