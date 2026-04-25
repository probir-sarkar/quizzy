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
    <section>
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden bg-gray-100 dark:bg-slate-950 pt-24 md:pt-32 pb-12 md:pb-20">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[70%] h-[70%] rounded-full bg-violet-500/10 dark:bg-violet-500/20 blur-[120px]" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[70%] h-[70%] rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Side */}
            <div className="flex-1 text-center lg:text-left w-full max-w-full">
              {/* Breadcrumb Skeleton */}
              <div className="mb-6 flex justify-center lg:justify-start">
                <ShimmerSkeleton className="h-5 w-48 rounded-full" />
              </div>

              {/* Category Badge Skeleton */}
              <div className="mb-6 flex justify-center lg:justify-start">
                <ShimmerSkeleton className="h-8 w-32 rounded-full" />
              </div>

              {/* Title Skeleton */}
              <div className="mb-6 space-y-3 flex flex-col items-center lg:items-start">
                <ShimmerSkeleton className="h-10 sm:h-12 md:h-16 w-3/4 rounded-2xl" />
                <ShimmerSkeleton className="h-10 sm:h-12 md:h-16 w-1/2 rounded-2xl" />
              </div>

              {/* Description Skeleton */}
              <div className="mb-8 space-y-2 max-w-2xl flex flex-col items-center lg:items-start">
                <ShimmerSkeleton className="h-5 w-full rounded-xl" />
                <ShimmerSkeleton className="h-5 w-5/6 rounded-xl" />
              </div>

              {/* Tags Skeleton */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {[1, 2, 3].map((i) => (
                  <ShimmerSkeleton key={i} className="h-10 w-24 rounded-xl" />
                ))}
              </div>
            </div>

            {/* Right Side: Stats Panel Skeleton */}
            <div className="w-full max-w-md">
              <div className="relative p-1 rounded-[2.5rem] bg-linear-to-br from-gray-200 to-gray-100 dark:from-white/10 dark:to-white/0 border border-gray-200 dark:border-white/10 backdrop-blur-2xl overflow-hidden">
                <div className="bg-white/80 dark:bg-slate-900/50 rounded-[2.3rem] p-6 sm:p-8">
                  {/* Stats Title */}
                  <div className="mb-8">
                    <ShimmerSkeleton className="h-7 w-48 rounded-xl" />
                  </div>

                  <div className="space-y-6">
                    {/* Total Questions Skeleton */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        <ShimmerSkeleton className="h-10 w-10 rounded-xl" />
                        <ShimmerSkeleton className="h-5 w-32 rounded-lg" />
                      </div>
                      <ShimmerSkeleton className="h-8 w-8 rounded-lg" />
                    </div>

                    {/* Difficulty Level Skeleton */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        <ShimmerSkeleton className="h-10 w-10 rounded-xl" />
                        <ShimmerSkeleton className="h-5 w-36 rounded-lg" />
                      </div>
                      <ShimmerSkeleton className="h-5 w-24 rounded-lg" />
                    </div>
                  </div>

                  {/* CTA Button Skeleton */}
                  <div className="mt-10">
                    <ShimmerSkeleton className="h-14 w-full rounded-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Section Skeleton */}
      <div className="mx-auto max-w-7xl pb-32">
        {/* Sticky Progress Bar Skeleton */}
        <div className="sticky top-0 z-50 bg-gray-50/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <ShimmerSkeleton className="h-8 w-full rounded-xl" />
          </div>
        </div>

        {/* Header Skeleton */}
        <div className="px-4 sm:px-6 py-4 md:py-10 space-y-2">
          <ShimmerSkeleton className="h-9 sm:h-10 w-48 rounded-xl" />
          <ShimmerSkeleton className="h-5 w-64 rounded-lg" />
        </div>

        {/* Questions List Skeleton */}
        <ol className="max-w-4xl pl-4 sm:pl-7 pr-4 sm:pr-6 space-y-6 sm:space-y-8">
          {[1, 2, 3].map((i) => (
            <li key={i}>
              <div className="relative rounded-3xl sm:rounded-4xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-slate-950/50 backdrop-blur-xl p-5 sm:p-10">
                {/* Question Number */}
                <div className="absolute -left-3 -top-3 sm:-left-4 sm:-top-4">
                  <ShimmerSkeleton className="h-8 w-8 sm:h-12 sm:w-12 rounded-lg sm:rounded-2xl" />
                </div>

                {/* Question Text Skeleton */}
                <div className="mb-4 sm:mb-8 pr-1 space-y-2">
                  <ShimmerSkeleton className="h-6 sm:h-7 w-full rounded-xl" />
                  <ShimmerSkeleton className="h-6 sm:h-7 w-2/3 rounded-xl" />
                </div>

                {/* Options Skeleton */}
                <fieldset className="space-y-2">
                  {[1, 2, 3, 4].map((opt) => (
                    <div key={opt} className="relative">
                      <ShimmerSkeleton className="h-10 sm:h-11 w-full rounded-lg" />
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
