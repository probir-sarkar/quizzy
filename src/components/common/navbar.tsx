"use client";

import { Sparkles, Menu, X, Home, BookOpen, Star, Gamepad2, ChevronDown } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/category", label: "Quiz Categories", icon: BookOpen },
    { href: "/horoscope", label: "Horoscope", icon: Star }
    // { href: "/quiz", label: "Quizzes", icon: Gamepad2 },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={cn(
        `sticky top-0 z-50 glass border-b  dark:border-gray-800 border-gray-200`,
        "bg-white/20 border border-white/30 backdrop-blur-md  dark:bg-white/5 dark:border-white/10 "
      )}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className={`font-bold text-lg  dark:text-white text-gray-900`}>Quiz Zone</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1"
            >
              Menu
              <ChevronDown className="w-4 h-4" />
            </Button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border rounded-md shadow-lg z-50">
                <div className="py-1">
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.href}
                        onClick={() => handleNavigation(item.href)}
                        className={cn(
                          "flex items-center gap-2 w-full px-3 py-2 text-sm text-left",
                          "hover:bg-accent hover:text-accent-foreground",
                          "transition-colors duration-200"
                        )}
                      >
                        <IconComponent className="w-4 h-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="h-9 w-9">
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu - Fixed positioning to prevent layout shift */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 md:hidden border-t dark:border-gray-800 border-gray-200 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg z-40">
          <div className="px-4 py-3 space-y-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    closeMobileMenu();
                  }}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-left",
                    "text-gray-700 dark:text-gray-200",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    "transition-colors duration-200"
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
