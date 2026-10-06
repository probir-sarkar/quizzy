import { useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/**
 * Minimal replacement for nextjs-toploader: a thin ink bar across the top of
 * the viewport while the router is loading a navigation.
 */
export function TopLoader() {
  const isLoading = useRouterState({ select: (s) => s.isLoading });

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5">
      <div
        className={cn(
          "h-full origin-left bg-foreground transition-[width,opacity] ease-out",
          isLoading ? "w-2/3 opacity-100 duration-[1200ms]" : "w-full opacity-0 duration-300 delay-150"
        )}
      />
    </div>
  );
}
