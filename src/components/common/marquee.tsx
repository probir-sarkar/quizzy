import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: React.ReactNode;
  /** Seconds for one full loop of the content. */
  duration?: number;
  className?: string;
};

/** Pure-CSS infinite ticker (pauses on hover). Render content twice inside. */
export default function Marquee({ children, duration = 42, className }: MarqueeProps) {
  return (
    <div className={cn("marquee overflow-hidden", className)}>
      <div
        className="animate-marquee flex w-max"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
