export default function HistoryLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <section className="border-b-2 border-foreground">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-4 pt-28 pb-12 sm:px-6 md:pt-36 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="h-3 w-48 animate-pulse bg-muted" />
            <div className="mt-4 h-16 w-full max-w-2xl animate-pulse bg-muted sm:h-24" />
            <div className="mt-4 h-16 w-2/3 animate-pulse bg-muted sm:h-24" />
            <div className="mt-6 h-4 w-full max-w-xl animate-pulse bg-muted" />
            <div className="rule-dotted mt-8 flex gap-12 pt-6">
              <div className="h-12 w-32 animate-pulse bg-muted" />
              <div className="h-12 w-32 animate-pulse bg-muted" />
            </div>
          </div>
          <div className="hidden lg:col-span-4 lg:flex lg:justify-center">
            <div className="h-56 w-72 rotate-2 animate-pulse border-2 border-foreground/30" />
          </div>
        </div>
      </section>

      {/* Date picker bar skeleton */}
      <section className="border-b-2 border-foreground bg-muted/40">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="h-3 w-64 animate-pulse bg-muted" />
          <div className="flex gap-2">
            <div className="h-11 w-11 animate-pulse border-2 border-foreground/30" />
            <div className="h-11 w-40 animate-pulse border-2 border-foreground/30" />
            <div className="h-11 w-11 animate-pulse border-2 border-foreground/30" />
            <div className="ml-2 h-11 w-24 animate-pulse border-2 border-foreground/30" />
            <div className="h-11 w-20 animate-pulse border-2 border-foreground/30" />
          </div>
        </div>
      </section>

      {/* Timeline rows skeleton */}
      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
        <div className="border-t-2 border-foreground">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-1 gap-4 border-b-2 border-dotted border-foreground/40 py-8 md:grid-cols-12 md:gap-8"
            >
              <div className="md:col-span-2">
                <div className="h-10 w-24 animate-pulse bg-muted" />
                <div className="mt-2 h-3 w-12 animate-pulse bg-muted" />
              </div>
              <div className="md:col-span-10">
                <div className="h-3 w-32 animate-pulse bg-muted" />
                <div className="mt-3 h-7 w-3/4 animate-pulse bg-muted" />
                <div className="mt-3 h-4 w-full max-w-2xl animate-pulse bg-muted" />
                <div className="mt-2 h-4 w-2/3 max-w-xl animate-pulse bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
