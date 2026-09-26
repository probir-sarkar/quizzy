export default function QuizLoading() {
  return (
    <section className="bg-gray-50 dark:bg-slate-950 min-h-screen">
      {/* Hero skeleton */}
      <div className="relative overflow-hidden bg-linear-to-b from-slate-300 to-gray-50 dark:from-slate-900 dark:to-slate-950 pt-24 md:pt-28 pb-12 md:pb-16 border-b border-gray-200 dark:border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 animate-pulse">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-6">
            {[10, 20, 16].map((w, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-3 rounded-full bg-white/60 dark:bg-white/10" style={{ width: `${w}rem` }} />
                <div className="h-3 w-3 rounded-full bg-white/60 dark:bg-white/10" />
              </div>
            ))}
          </div>

          {/* Difficulty badge + question count */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 w-24 rounded-full bg-gradient-to-r from-violet-300 to-fuchsia-300 dark:from-violet-500/40 dark:to-fuchsia-500/40" />
            <div className="h-6 w-32 rounded-full bg-white/60 dark:bg-white/10" />
          </div>

          {/* Title */}
          <div className="h-10 md:h-12 w-3/4 rounded-xl bg-white/70 dark:bg-white/10 mb-3" />
          <div className="h-10 md:h-12 w-1/2 rounded-xl bg-white/70 dark:bg-white/10 mb-6" />

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-white/60 dark:bg-white/5" />
            <div className="h-4 w-5/6 rounded bg-white/60 dark:bg-white/5" />
          </div>
        </div>
      </div>

      {/* Questions skeleton */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-6 sm:p-8 animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="flex items-start gap-3 mb-5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-200 to-fuchsia-200 dark:from-violet-500/40 dark:to-fuchsia-500/40 flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 w-11/12 rounded bg-gray-200 dark:bg-white/10" />
                <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-white/10" />
              </div>
            </div>
            <div className="grid gap-3">
              {["a", "b", "c", "d"].map((k) => (
                <div key={k} className="h-11 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
