import { TELEGRAM_CHANNEL_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import Link from "next/link";

type Props = {
  className?: string;
};
const TelegramCTA = ({ className = "" }: Props) => {
  return (
    <div
      className={cn(
        "pop-hover mt-10 flex items-center justify-between gap-4 border-2 border-foreground bg-card p-4 shadow-pop [--pop:var(--pop-cyan)] [--pop-x:6px] [--pop-y:6px] sm:p-5",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-foreground bg-cyan-300 text-foreground">
          <Send className="h-5 w-5" />
        </span>
        <div>
          <p className="font-sans text-base font-black uppercase tracking-tight">Never miss a quiz</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Daily challenges on Telegram
          </p>
        </div>
      </div>
      <Link
        href={TELEGRAM_CHANNEL_URL}
        target="_blank"
        className="pop-hover shrink-0 border-2 border-foreground bg-foreground px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-background shadow-pop [--pop:var(--pop-rose)] [--pop-x:3px] [--pop-y:3px]"
      >
        Join Now
      </Link>
    </div>
  );
};

export default TelegramCTA;
