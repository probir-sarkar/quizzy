const block = "border-2 border-foreground/30 animate-pulse";

export default function QuizLoading() {
  return (
    <section className="min-h-screen">
      {/* Hero skeleton */}
      <div className="border-b-2 border-foreground">
        <div className="mx-auto max-w-[1400px] px-4 pt-28 pb-12 sm:px-6 md:pt-36">
          <div className={`mb-4 h-3 w-56 ${block}`} />
          <div className={`mb-6 h-3 w-40 ${block}`} />
          <div className="space-y-3">
            <div className={`h-10 w-3/4 max-w-2xl ${block}`} />
            <div className={`h-10 w-1/2 max-w-xl ${block}`} />
          </div>
          <div className="mt-6 space-y-2">
            <div className={`h-4 w-full max-w-2xl ${block}`} />
            <div className={`h-4 w-5/6 max-w-2xl ${block}`} />
          </div>
          <div className="mt-7 flex flex-wrap gap-2.5">
            {[80, 64, 88, 56].map((w, i) => (
              <div key={i} className={`h-8 ${block}`} style={{ width: `${w}px` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Questions header */}
      <div className="mx-auto max-w-[1400px] px-4 pt-12 sm:px-6">
        <div className={`h-10 w-64 ${block}`} />
        <div className={`mt-3 h-3 w-80 max-w-full ${block}`} />
      </div>

      {/* Question skeletons */}
      <div className="mx-auto max-w-[1400px] pb-16">
        <ol className="max-w-3xl space-y-6 px-4 pt-10 sm:px-6">
          {[0, 1, 2].map((i) => (
            <li key={i} className={`${block} p-5 sm:p-6`} style={{ animationDelay: `-${i * 150}ms` }}>
              <div className="mb-3 h-3 w-28" />
              <div className="mb-4 space-y-2">
                <div className="h-4 w-11/12" />
                <div className="h-4 w-2/3" />
              </div>
              <div className="space-y-2.5">
                {["a", "b", "c", "d"].map((k) => (
                  <div key={k} className="h-11 border-2 border-foreground/20" />
                ))}
              </div>
            </li>
          ))}
        </ol>

        {/* Progress skeleton */}
        <div className="max-w-3xl px-4 pt-6 sm:px-6">
          <div className={`${block} p-6`}>
            <div className="mb-3 h-4 w-44" />
            <div className="h-4 w-full border-2 border-foreground/30" />
          </div>
        </div>
      </div>
    </section>
  );
}
