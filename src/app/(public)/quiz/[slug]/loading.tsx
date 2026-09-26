const cardShell =
  "rounded-2xl border border-white/10 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] p-5 sm:p-6";

export default function QuizLoading() {
  return (
    <section className="bg-gray-50 dark:bg-slate-950 min-h-screen">
      {/* Hero skeleton */}
      <div className="relative overflow-hidden bg-linear-to-b from-slate-300 to-gray-50 dark:from-slate-900 dark:to-slate-950 pt-24 md:pt-28 pb-12 md:pb-16 border-b border-gray-200 dark:border-white/5">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[70%] h-[70%] rounded-full bg-linear-to-br from-violet-400 to-fuchsia-500 opacity-10 dark:opacity-20 blur-[120px]" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[70%] h-[70%] rounded-full bg-linear-to-br from-violet-400 to-fuchsia-500 opacity-5 dark:opacity-10 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 animate-pulse">
          {/* Breadcrumbs */}
          <div className="mb-4 flex justify-center lg:justify-start">
            <div className="flex items-center gap-2">
              {[40, 72, 56].map((w, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-3 rounded-full bg-white/60 dark:bg-white/10" style={{ width: `${w}px` }} />
                  <div className="h-3 w-3 rounded-full bg-white/60 dark:bg-white/10" />
                </div>
              ))}
            </div>
          </div>

          {/* Category pill */}
          <div className="flex justify-center lg:justify-start mb-4">
            <div className="h-7 w-24 rounded-full border border-gray-200/50 dark:border-white/10 bg-white/40 dark:bg-white/5" />
          </div>

          {/* Title */}
          <div className="space-y-3 mb-4">
            <div className="h-8 md:h-10 lg:h-12 w-3/4 max-w-2xl mx-auto lg:mx-0 rounded-xl bg-white/70 dark:bg-white/10" />
            <div className="h-8 md:h-10 lg:h-12 w-1/2 max-w-xl mx-auto lg:mx-0 rounded-xl bg-white/70 dark:bg-white/10" />
          </div>

          {/* Description */}
          <div className="space-y-2 mb-5">
            <div className="h-4 w-full max-w-2xl mx-auto lg:mx-0 rounded bg-white/60 dark:bg-white/5" />
            <div className="h-4 w-5/6 max-w-2xl mx-auto lg:mx-0 rounded bg-white/60 dark:bg-white/5" />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2">
            {[80, 64, 88, 56].map((w, i) => (
              <div
                key={i}
                className="h-8 rounded-lg border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5"
                style={{ width: `${w}px` }}
              />
            ))}
          </div>

          {/* Questions & Difficulty chips */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-5">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-10 w-36 rounded-xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Questions header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 animate-pulse">
        <div className="h-6 md:h-7 w-44 rounded bg-gray-300/70 dark:bg-white/10 mb-2" />
        <div className="h-4 w-72 max-w-full rounded bg-gray-200/80 dark:bg-white/5" />
      </div>

      {/* Questions skeleton */}
      <div className="max-w-7xl mx-auto pb-8">
        <ol className="max-w-4xl pl-4 sm:pl-7 pr-4 sm:pr-6 space-y-5 sm:space-y-6">
          {[0, 1, 2].map((i) => (
            <li
              key={i}
              className={`${cardShell} animate-pulse`}
              style={{ animationDelay: `-${i * 150}ms` }}
            >
              {/* Question number */}
              <div className="h-3 w-28 rounded bg-violet-400/40 dark:bg-violet-400/20 mb-3" />

              {/* Question text */}
              <div className="space-y-2 mb-4">
                <div className="h-4 w-11/12 rounded bg-gray-200/80 dark:bg-white/10" />
                <div className="h-4 w-2/3 rounded bg-gray-200/80 dark:bg-white/10" />
              </div>

              {/* Answer options */}
              <div className="space-y-2">
                {["a", "b", "c", "d"].map((k) => (
                  <div
                    key={k}
                    className="h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  />
                ))}
              </div>
            </li>
          ))}
        </ol>

        {/* Progress card */}
        <div className="max-w-4xl pl-4 sm:pl-7 pr-4 sm:pr-6 mt-5 sm:mt-6">
          <div className={`${cardShell} animate-pulse`}>
            <div className="h-4 w-44 rounded bg-gray-200/80 dark:bg-white/10 mb-3" />
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    </section>
  );
}
