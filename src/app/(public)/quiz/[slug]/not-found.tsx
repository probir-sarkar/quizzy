import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-24">
      <div className="w-full max-w-2xl border-2 border-foreground bg-card shadow-pop [--pop:var(--pop-amber)] [--pop-x:10px] [--pop-y:10px]">
        <div className="flex items-center justify-between border-b-2 border-dotted border-foreground/40 px-6 py-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
            Error 404 — page missing
          </span>
          <span className="bg-halftone hidden h-4 w-20 text-foreground/40 sm:block" aria-hidden />
        </div>

        <div className="p-6 sm:p-10">
          <p className="font-sans text-[6rem] font-black leading-none tracking-tighter sm:text-[8rem]">4Ω4</p>
          <h1 className="mt-4 font-sans text-2xl font-black uppercase tracking-tight sm:text-3xl">
            We couldn&apos;t find that quiz
          </h1>
          <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
            It might have been removed, unpublished, or the link is a typo. The archive, however, is still full —
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="pop-hover inline-flex items-center justify-center border-2 border-foreground bg-foreground px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-background shadow-pop [--pop:var(--pop-lime)] [--pop-x:4px] [--pop-y:4px]"
            >
              Front Page
            </Link>
            <Link
              href="/category"
              className="pop-hover inline-flex items-center justify-center border-2 border-foreground bg-background px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] shadow-pop [--pop:var(--pop-violet)] [--pop-x:4px] [--pop-y:4px] hover:bg-foreground hover:text-background"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
