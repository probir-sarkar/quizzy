"use client";

import { Search, ArrowUpDown } from "lucide-react";
import { useState, useMemo } from "react";
import { CategoryCard } from "./category-card";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

interface Category {
  id: number;
  name: string;
  slug: string;
  _count: {
    quizzes: number;
    subCategories: number;
  } | null;
}

interface CategoryFilterProps {
  categories: Category[];
}

type SortOption = "name-asc" | "name-desc" | "quizzes-desc" | "quizzes-asc";

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filteredCategories = useMemo(() => {
    let result = [...categories];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((cat) => cat.name.toLowerCase().includes(query));
    }

    // Sort
    result.sort((a, b) => {
      const aQuizCount = a._count?.quizzes ?? 0;
      const bQuizCount = b._count?.quizzes ?? 0;

      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "quizzes-desc":
          return bQuizCount - aQuizCount;
        case "quizzes-asc":
          return aQuizCount - bQuizCount;
        default:
          return 0;
      }
    });

    return result;
  }, [categories, searchQuery, sortBy]);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "quizzes-desc", label: "Most Quizzes" },
    { value: "quizzes-asc", label: "Least Quizzes" },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search the index..."
            className="w-full border-2 border-foreground bg-background py-3 pr-4 pl-11 font-mono text-sm placeholder:text-muted-foreground"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative sm:w-auto">
          <button
            type="button"
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex w-full items-center justify-center gap-2 border-2 border-foreground bg-background px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] transition-colors hover:bg-foreground hover:text-background sm:w-auto"
          >
            <ArrowUpDown className="h-4 w-4 shrink-0" />
            <span className="truncate">{sortOptions.find((opt) => opt.value === sortBy)?.label}</span>
          </button>

          {isSortOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
              <div className="absolute top-full right-0 left-0 z-20 mt-2 overflow-hidden border-2 border-foreground bg-card shadow-pop [--pop:var(--pop-violet)] [--pop-x:5px] [--pop-y:5px] sm:left-auto sm:min-w-48">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSortBy(option.value);
                      setIsSortOpen(false);
                    }}
                    className={`w-full border-b border-dotted border-foreground/30 px-4 py-2.5 text-left font-mono text-xs font-bold uppercase tracking-[0.14em] transition-colors last:border-b-0 ${
                      sortBy === option.value
                        ? "bg-foreground text-background"
                        : "hover:bg-muted"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Results count */}
      {searchQuery && (
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"} found
        </p>
      )}

      {/* Render filtered categories */}
      {filteredCategories.length > 0 ? (
        <Stagger gap={0.03} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((cat) => (
            <StaggerItem key={cat.id}>
              <CategoryCard category={cat} />
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <div className="border-2 border-dashed border-foreground/40 py-20 text-center">
          <h3 className="font-sans text-2xl font-black uppercase tracking-tight">Nothing filed under that</h3>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
