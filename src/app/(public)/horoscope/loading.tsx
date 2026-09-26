export default function HoroscopeLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <section className="border-b-2 border-foreground">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-4 pt-28 pb-14 sm:px-6 md:pt-36 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="h-3 w-64 animate-pulse bg-muted" />
            <div className="mt-4 h-16 w-3/4 animate-pulse bg-muted sm:h-24" />
            <div className="mt-4 h-16 w-1/2 animate-pulse bg-muted sm:h-24" />
            <div className="mt-6 h-4 w-full max-w-lg animate-pulse bg-muted" />
            <div className="mt-8 flex gap-3">
              <div className="h-11 w-32 animate-pulse border-2 border-foreground/30" />
              <div className="h-11 w-24 animate-pulse border-2 border-foreground/30" />
              <div className="h-11 w-24 animate-pulse border-2 border-foreground/30" />
            </div>
          </div>
          <div className="hidden lg:col-span-5 lg:flex lg:justify-center">
            <div className="h-80 w-72 rotate-2 animate-pulse border-2 border-foreground/30" />
          </div>
        </div>
      </section>

      {/* Sign card grid skeleton */}
      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse border-2 border-foreground/30" style={{ animationDelay: `-${i * 120}ms` }} />
          ))}
        </div>
      </section>
    </div>
  );
}
