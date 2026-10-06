import { CategoryCardSkeleton } from "@/components/category/category-card";

export function CategorySkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton — mirrors the "All Categories" hero */}
      <section className="border-b-2 border-foreground">
        <div className="mx-auto max-w-[1400px] px-4 pt-28 pb-12 sm:px-6 md:pt-36">
          <div className="h-3 w-36 animate-pulse bg-muted" />
          <div className="mt-6 h-3 w-40 animate-pulse bg-muted" />
          <div className="mt-4 h-16 w-2/3 animate-pulse bg-muted sm:h-24" />
          <div className="mt-6 h-4 w-full max-w-xl animate-pulse bg-muted" />
          <div className="h-4 w-4/5 max-w-lg animate-pulse bg-muted" />
          <div className="rule-dotted mt-8 flex gap-12 pt-6">
            <div className="h-12 w-28 animate-pulse bg-muted" />
            <div className="h-12 w-28 animate-pulse bg-muted" />
          </div>
        </div>
      </section>

      {/* Search + sort bar skeleton */}
      <section className="mx-auto max-w-[1400px] px-4 pt-12 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="h-12 flex-1 animate-pulse border-2 border-foreground/30" />
          <div className="h-12 w-full animate-pulse border-2 border-foreground/30 sm:w-56" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
