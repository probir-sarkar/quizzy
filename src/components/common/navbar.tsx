"use client";

import { Sparkles, Menu, X, Home, BookOpen, Star, ChevronDown, Calendar, Search } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/category", label: "Categories", icon: BookOpen },
    { href: "/horoscope", label: "Horoscope", icon: Star },
    { href: "/this-day-in-history", label: "History", icon: Calendar }
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "pointer-events-auto transition-all duration-300 ease-in-out",
          "flex items-center gap-4 px-4 h-14 rounded-2xl border w-full max-w-5xl",
          scrolled
            ? "bg-white/80 dark:bg-slate-950/80 border-white/20 dark:border-white/10 backdrop-blur-xl shadow-2xl scale-[1.01]"
            : "bg-white/40 dark:bg-white/5 border-transparent backdrop-blur-sm"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group mr-auto">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-violet-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight dark:text-white text-slate-900">Quiz Zone</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-medium h-9 rounded-xl hover:bg-white/10 dark:hover:bg-white/5"
              >
                {item.label}
              </Button>
            </Link>
          ))}

          <div className="w-px h-4 bg-slate-500/20 mx-2" />

          <ThemeToggle />

          <Button
            variant="default"
            size="sm"
            className="ml-2 h-9 rounded-xl bg-violet-600 hover:bg-violet-500 text-white border-0 shadow-lg shadow-violet-600/20 text-xs font-bold"
          >
            All Quizzes
          </Button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="h-9 w-9 rounded-xl overflow-hidden relative"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute top-20 left-4 right-4 md:hidden p-4 rounded-3xl bg-white/95 dark:bg-slate-950/95 border border-white/20 dark:border-white/10 backdrop-blur-2xl shadow-2xl z-50 pointer-events-auto"
          >
            <div className="grid grid-cols-2 gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-500/5 hover:bg-violet-500/10 transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 text-violet-500" />
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <Button className="w-full mt-4 h-12 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm">
              Explore All Quizzes
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
