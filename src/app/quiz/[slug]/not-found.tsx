// app/quiz/[slug]/not-found.tsx
import Link from "next/link";
import { Home,  Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6">
      {/* Gradient banner background */}
      {/* <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-r from-rose-500 to-fuchsia-600 dark:from-fuchsia-600 dark:to-pink-600" /> */}

      <section className="relative w-full max-w-xl rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-black/5 dark:border-white/10 shadow-xl p-8">
        {/* Header */}
        <div className="mb-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-black/5 dark:bg-white/10 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200">
            <Search className="h-3.5 w-3.5" />
            No quiz found
          </span>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            We couldn’t find that quiz
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            The quiz might have been removed, unpublished, or the link is incorrect.
          </p>
        </div>

        {/* Helpful suggestions */}
        <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-2 mb-6 list-disc pl-5">
          <li>Check the URL for typos.</li>
          <li>Browse our categories to discover other quizzes.</li>
          <li>Head back to the homepage and try a search.</li>
        </ul>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-medium hover:opacity-90 transition"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
