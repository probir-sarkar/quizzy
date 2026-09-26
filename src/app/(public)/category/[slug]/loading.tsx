export default function CategoryDetailLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton — mirrors CategoryHero */}
      <section className="border-b-2 border-foreground">
        <div className="mx-auto max-w-[1400px] px-4 pt-28 pb-12 sm:px-6 md:pt-36">
          <div className="h-3 w-36 animate-pulse bg-muted" />
          <div className="mt-6 h-3 w-52 animate-pulse bg-muted" />
          <div className="mt-4 h-16 w-3/4 animate-pulse bg-muted sm:h-24" />
          <div className="mt-6 h-4 w-full max-w-xl animate-pulse bg-muted" />
          <div className="h-4 w-4/5 max-w-lg animate-pulse bg-muted" />
          <div className="rule-dotted mt-8 flex gap-12 pt-6">
            <div className="h-12 w-28 animate-pulse bg-muted" />
            <div className="h-12 w-28 animate-pulse bg-muted" />
          </div>
        </div>
      </section>

      {/* Sticky filter bar skeleton */}
      <section className="border-b-2 border-foreground bg-muted/40">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="h-11 w-56 animate-pulse border-2 border-foreground/30" />
          <div className="h-3 w-24 animate-pulse bg-muted" />
        </div>
      </section>

      {/* Quiz grid skeleton — same shape as QuizList's query skeleton */}
      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse border-2 border-foreground/30" style={{ animationDelay: `-${i * 120}ms` }} />
          ))}
        </div>
      </section>
    </div>
  );
}
