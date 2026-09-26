"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md border-2 border-foreground bg-card p-8 text-center shadow-pop [--pop:var(--pop-rose)] [--pop-x:8px] [--pop-y:8px]">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
          Error 500 — press stopped
        </p>
        <h1 className="mt-3 font-sans text-4xl font-black uppercase tracking-tight">Ink spill</h1>
        <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
          Something went wrong at the printing press. Don&apos;t worry — your quiz progress is safe.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="pop-hover inline-flex flex-1 cursor-pointer items-center justify-center gap-2 border-2 border-foreground bg-foreground px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-background shadow-pop [--pop:var(--pop-lime)] [--pop-x:4px] [--pop-y:4px]"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="pop-hover inline-flex flex-1 items-center justify-center border-2 border-foreground bg-background px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] shadow-pop [--pop:var(--pop-violet)] [--pop-x:4px] [--pop-y:4px] hover:bg-foreground hover:text-background"
          >
            Go Home
          </Link>
        </div>

        {process.env.NODE_ENV === "development" && error.message && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Error details
            </summary>
            <pre className="mt-2 overflow-auto border-2 border-dashed border-foreground/40 p-3 font-mono text-xs">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
