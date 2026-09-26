import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const POP_CYCLE = [
  "var(--pop-violet)",
  "var(--pop-lime)",
  "var(--pop-cyan)",
  "var(--pop-rose)",
  "var(--pop-amber)",
  "var(--pop-blue)"
];

interface CategoryCardProps {
  category: {
    id: number;
    name: string;
    slug: string;
    _count: {
      quizzes: number;
      subCategories: number;
    } | null;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  const quizCount = category._count?.quizzes ?? 0;
  const subCategoryCount = category._count?.subCategories ?? 0;

  return (
    <Link
      href={`/category/${category.slug}`}
      prefetch
      className="pop-hover group flex items-center justify-between gap-4 border-2 border-foreground bg-card p-5 shadow-pop [--pop-x:6px] [--pop-y:6px]"
      style={{ "--pop": POP_CYCLE[category.id % POP_CYCLE.length] } as React.CSSProperties}
    >
      <div className="min-w-0">
        <h3 className="truncate font-sans text-xl font-black uppercase tracking-tight">{category.name}</h3>
        <p className="mt-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {quizCount} quiz{quizCount !== 1 ? "zes" : ""}
          {subCategoryCount > 0 && ` · ${subCategoryCount} sub-topics`}
        </p>
      </div>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-foreground transition-all duration-200 group-hover:rotate-45 group-hover:bg-foreground group-hover:text-background">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 border-2 border-foreground/30 p-5">
      <div className="min-w-0">
        <div className="h-6 w-32 animate-pulse bg-muted" />
        <div className="mt-2 h-3 w-24 animate-pulse bg-muted" />
      </div>
      <div className="h-10 w-10 shrink-0 animate-pulse bg-muted" />
    </div>
  );
}
