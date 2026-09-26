import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryFiltersProps {
  categories: { name: string; slug: string }[];
}

const POP_CYCLE = [
  "var(--pop-violet)",
  "var(--pop-lime)",
  "var(--pop-cyan)",
  "var(--pop-rose)",
  "var(--pop-amber)",
  "var(--pop-blue)"
];

export default function CategoryFilters({ categories }: CategoryFiltersProps) {
  return (
    <div id="categories" className="mx-auto max-w-[1400px] px-4 pt-20 sm:px-6">
      <p className="mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
        Jump straight in
      </p>
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-3">
        <Link href="/category" className="shrink-0">
          <span
            className={cn(
              "pop-hover inline-block border-2 border-foreground bg-foreground px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-background shadow-pop [--pop:var(--pop-lime)]"
            )}
          >
            Explore All
          </span>
        </Link>

        {categories.map((cat, i) => (
          <Link key={cat.slug} href={`/category/${cat.slug}`} prefetch className="shrink-0">
            <span
              className="pop-hover inline-block border-2 border-foreground bg-background px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.14em] shadow-pop hover:bg-foreground hover:text-background"
              style={{ "--pop": POP_CYCLE[i % POP_CYCLE.length] } as React.CSSProperties}
            >
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
