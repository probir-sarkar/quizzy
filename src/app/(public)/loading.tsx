export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5">
      <div className="relative">
        <div className="h-10 w-10 animate-spin border-2 border-foreground border-t-transparent" />
        <span aria-hidden className="shadow-pop absolute inset-0 [--pop:var(--pop-lime)] [--pop-x:4px] [--pop-y:4px]" />
      </div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
        Setting the type…
      </p>
    </div>
  );
}
