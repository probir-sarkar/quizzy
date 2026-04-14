"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Shield, Zap, FileImage, Lock } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface ToolboxPromoCardProps {
  className?: string;
  variant?: "default" | "compact";
}

const features = [
  { icon: Shield, text: "100% Private" },
  { icon: Zap, text: "Lightning Fast" },
  { icon: FileImage, text: "PDF & Images" },
  { icon: Lock, text: "No Data Uploads" }
];

export default function ToolboxPromoCard({ className = "", variant = "default" }: ToolboxPromoCardProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  if (variant === "compact") {
    return (
      <motion.a
        href="https://toolbox.probir.dev/"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className={`block relative overflow-hidden rounded-xl border border-teal-200 dark:border-teal-800/30
          bg-linear-to-br from-teal-50 to-teal-100 dark:from-teal-950/50 dark:to-teal-900/30
          hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 ${className}`}
      >
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Toolbox</h3>
                <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">• Privacy tools</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                PDFs, images & passwords - 100% offline
              </p>
            </div>
            <div className="shrink-0">
              <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center
                hover:bg-teal-500 hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Gradient overlay for dark mode */}
        {isDark && (
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-teal-600/5 pointer-events-none" />
        )}
      </motion.a>
    );
  }

  return (
    <motion.a
      href="https://toolbox.probir.dev/"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`block relative overflow-hidden rounded-2xl border border-teal-200 dark:border-teal-800/30
        bg-linear-to-br from-teal-50 to-teal-100 dark:from-teal-950/50 dark:to-teal-900/30
        hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 ${className}`}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-linear-to-br from-teal-500/5 via-teal-600/5 to-teal-700/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Toolbox
                </h3>
                <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                  Privacy-Powered Tools
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
              Process PDFs, optimize images, and generate passwords - all in your browser with
              <span className="font-bold text-teal-600 dark:text-teal-400"> zero uploads</span> and
              <span className="font-bold text-teal-600 dark:text-teal-400"> complete privacy</span>.
            </p>

            <div className="flex flex-wrap gap-2">
              {features.map((feature, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full
                    bg-white dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/30
                    text-slate-700 dark:text-slate-300"
                >
                  <feature.icon className="w-3 h-3 text-teal-500 dark:text-teal-400" />
                  {feature.text}
                </span>
              ))}
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.2 }}
            className="shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-teal-500 to-teal-600
              flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-teal-200/50 dark:border-teal-800/20">
          <div className="text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-teal-600 dark:text-teal-400">Free & Open Source</span>
            <span className="mx-1.5">•</span>
            Works Offline
          </div>
          <div className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1 group">
            Try Now
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-teal-600/10 rounded-full blur-2xl pointer-events-none" />
    </motion.a>
  );
}
