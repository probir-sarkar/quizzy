import { Menu, X, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScrollProgress } from "@/components/motion/scroll-progress";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/category", label: "Categories" },
  { href: "/this-day-in-history", label: "History" }
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <ScrollProgress />

      <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-foreground bg-background/92 backdrop-blur-md">
        <motion.nav
          initial={{ y: -64 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto flex h-16 max-w-[1400px] items-stretch justify-between px-4 sm:px-6"
          aria-label="Main"
        >
          {/* Wordmark */}
          <Link to="/" className="group flex items-center gap-3" aria-label="Quizzy home">
            <span className="flex h-9 w-9 items-center justify-center bg-foreground font-sans text-lg font-black text-background shadow-pop transition-transform duration-300 [--pop:var(--pop-violet)] [--pop-x:3px] [--pop-y:3px] group-hover:-rotate-6">
              Q
            </span>
            <span className="font-sans text-xl font-black tracking-tight uppercase">
              Quizzy
              <span className="text-[0.6em] align-super">®</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-7 md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "group relative font-mono text-xs font-bold uppercase tracking-[0.18em] transition-colors",
                  isActive(item.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className={cn("mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-[1px] transition-colors", isActive(item.href) ? "bg-foreground" : "bg-transparent group-hover:bg-muted-foreground/50")} />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              to="/category"
              className="pop-hover hidden items-center gap-1.5 border-2 border-foreground bg-foreground px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-background shadow-pop [--pop:var(--pop-lime)] sm:inline-flex"
            >
              All Quizzes
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center border-2 border-foreground transition-colors hover:bg-foreground hover:text-background md:hidden"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </motion.nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t-2 border-dashed border-foreground/30 md:hidden"
            >
              <div className="flex flex-col px-4 py-2 sm:px-6">
                {navigationItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "group flex items-center justify-between border-b border-dotted border-foreground/30 py-4 font-sans text-2xl font-black uppercase tracking-tight last:border-b-0",
                        isActive(item.href) ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      <span>{item.label}</span>
                      <span className="font-mono text-xs font-normal">0{i + 1}</span>
                    </Link>
                  </motion.div>
                ))}
                <Link
                  to="/category"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="my-4 flex items-center justify-center gap-2 border-2 border-foreground bg-foreground py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-background"
                >
                  All Quizzes
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;
