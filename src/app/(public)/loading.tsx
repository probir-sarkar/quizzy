export default function Loading() {
  // Generic fallback — mirrors a broadsheet page shape instead of a spinner,
  // so even a worst-case load looks intentional and never layout-shifts.
  return (
    <div className="min-h-screen">
      <div className="border-b-2 border-foreground">
        <div className="mx-auto max-w-[1400px] px-4 pt-28 pb-12 sm:px-6 md:pt-36">
          <div className="h-3 w-48 animate-pulse bg-muted" />
          <div className="mt-4 h-14 w-2/3 max-w-2xl animate-pulse bg-muted sm:h-20" />
          <div className="mt-6 h-4 w-full max-w-xl animate-pulse bg-muted" />
          <div className="h-4 w-4/5 max-w-lg animate-pulse bg-muted" />
          <div className="rule-dotted mt-8 flex gap-12 pt-6">
            <div className="h-10 w-24 animate-pulse bg-muted" />
            <div className="h-10 w-24 animate-pulse bg-muted" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse border-2 border-foreground/30" style={{ animationDelay: `-${i * 120}ms` }} />
          ))}
        </div>
      </div>
      <p className="pb-10 text-center font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
        Setting the type…
      </p>
    </div>
  );
}
