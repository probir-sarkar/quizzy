"use client";

import { ArrowUpRight, ShieldCheck, Zap, FileImage, Lock } from "lucide-react";

interface BrowserStayPromoCardProps {
  className?: string;
  variant?: "default" | "compact";
}

const features = [
  { icon: ShieldCheck, text: "100% Private" },
  { icon: Zap, text: "No Waiting" },
  { icon: FileImage, text: "PDF & Images" },
  { icon: Lock, text: "No Uploads" }
];

export default function BrowserStayPromoCard({ className = "", variant = "default" }: BrowserStayPromoCardProps) {
  if (variant === "compact") {
    return (
      <a
        href="https://browserstay.com/"
        target="_blank"
        rel="noopener noreferrer"
        className={`pop-hover flex items-center gap-4 border-2 border-foreground bg-card p-4 shadow-pop [--pop:var(--pop-amber)] ${className}`}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-foreground bg-amber-300 text-foreground">
          <Zap className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="mb-0.5 flex items-center gap-2">
            <span className="font-sans text-base font-black uppercase tracking-tight">BrowserStay</span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              PDF &amp; image tools
            </span>
          </span>
          <span className="block truncate font-sans text-xs text-muted-foreground">
            Free, open-source PDF and image tools — 100% in your browser
          </span>
        </span>
        <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </a>
    );
  }

  return (
    <a
      href="https://browserstay.com/"
      target="_blank"
      rel="noopener noreferrer"
      className={`pop-hover group block border-2 border-foreground bg-card shadow-pop [--pop:var(--pop-amber)] [--pop-x:8px] [--pop-y:8px] ${className}`}
    >
      <div className="flex items-center justify-between border-b-2 border-dotted border-foreground/40 px-5 py-2.5 sm:px-6">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
          Sponsored — from the same maker
        </span>
        <span className="bg-halftone hidden h-4 w-24 text-foreground/40 sm:block" aria-hidden />
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div className="max-w-xl">
            <h3 className="font-sans text-2xl font-black uppercase tracking-tight sm:text-3xl">
              BrowserStay <span className="align-super text-sm">↗</span>
            </h3>
            <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground sm:text-base">
              A free, open-source collection of PDF and image tools that run entirely in your browser.{" "}
              <span className="font-bold text-foreground">No uploads, no accounts, no servers</span> — nothing ever
              leaves your machine.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {features.map((feature) => (
                <span
                  key={feature.text}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em]"
                >
                  <feature.icon className="h-3 w-3" />
                  {feature.text}
                </span>
              ))}
            </div>
          </div>

          <span className="pop-hover inline-flex shrink-0 items-center gap-2 border-2 border-foreground bg-foreground px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-background shadow-pop [--pop:var(--pop-cyan)] [--pop-x:4px] [--pop-y:4px]">
            Try It Now
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </a>
  );
}
