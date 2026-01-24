"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Admin Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
        >
          View Site
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
