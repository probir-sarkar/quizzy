import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

function ShimmerSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      className={cn(
        "bg-gray-200/50 dark:bg-white/3",
        className
      )}
      {...props}
    />
  )
}

export default function QuizPageLoading() {
  return (
    <section className="bg-gray-50 dark:bg-slate-950">
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden bg-gray-100 dark:bg-slate-950 pt-24 md:pt-28 pb-12 md:pb-16">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[70%] h-[70%] rounded-full bg-violet-500/10 dark:bg-violet-500/20 blur-[120px]" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[70%] h-[70%] rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            {/* Left Side */}
            <div className="flex-1 text-center lg:text-left w-full max-w-full">
              {/* Breadcrumb Skeleton */}
              <div className="mb-4 flex justify-center lg:justify-start">
                <ShimmerSkeleton className="h-5 w-48 rounded-full" />
              </div>

              {/* Category Badge Skeleton */}
              <div className="mb-4 flex justify-center lg:justify-start">
                <ShimmerSkeleton className="h-7 w-28 rounded-full" />
              </div>

              {/* Title Skeleton */}
              <div className="mb-2 space-y-2 flex flex-col items-center lg:items-start">
                <ShimmerSkeleton className="h-9 sm:h-10 md:h-12 lg:h-14 w-3/4 rounded-xl" />
                <ShimmerSkeleton className="h-9 sm:h-10 md:h-12 lg:h-14 w-1/2 rounded-xl" />
              </div>

              {/* Description Skeleton */}
              <div className="mb-5 space-y-2 max-w-2xl flex flex-col items-center lg:items-start mt-2">
                <ShimmerSkeleton className="h-5 w-full rounded-lg" />
                <ShimmerSkeleton className="h-5 w-5/6 rounded-lg" />
              </div>

              {/* Tags Skeleton */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                {[1, 2, 3].map((i) => (
                  <ShimmerSkeleton key={i} className="h-8 w-20 rounded-lg" />
                ))}
              </div>

              {/* Questions & Difficulty Info Skeleton */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-5">
                <ShimmerSkeleton className="h-10 w-32 rounded-xl" />
                <ShimmerSkeleton className="h-10 w-28 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Section Skeleton */}
      <div className="mx-auto max-w-7xl pb-32">
        {/* Border Separator */}
        <div className="border-t border-gray-200 dark:border-white/10" />

        {/* Header Skeleton */}
        <div className="px-4 sm:px-6 py-6 md:py-10 space-y-2">
          <ShimmerSkeleton className="h-8 sm:h-9 w-40 rounded-lg" />
          <ShimmerSkeleton className="h-4 w-56 rounded-lg" />
        </div>

        {/* Questions List Skeleton */}
        <ol className="max-w-4xl pl-4 sm:pl-7 pr-4 sm:pr-6 space-y-5 sm:space-y-6">
          {[1, 2, 3].map((i) => (
            <li key={i}>
              <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-slate-950/50 backdrop-blur-xl p-5 sm:p-6">
                {/* Question Progress Indicator */}
                <div className="mb-3">
                  <ShimmerSkeleton className="h-4 w-24 rounded" />
                </div>

                {/* Question Text Skeleton */}
                <div className="mb-4 space-y-2">
                  <ShimmerSkeleton className="h-5 sm:h-6 w-full rounded-lg" />
                  <ShimmerSkeleton className="h-5 sm:h-6 w-2/3 rounded-lg" />
                </div>

                {/* Options Skeleton */}
                <fieldset className="space-y-2">
                  {[1, 2, 3, 4].map((opt) => (
                    <div key={opt} className="relative">
                      <ShimmerSkeleton className="h-10 w-full rounded-lg" />
                    </div>
                  ))}
                </fieldset>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
