import { TELEGRAM_CHANNEL_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import Link from "next/link";

type Props = {
  className?: string;
};
const TelegramCTA = ({ className = "" }: Props) => {
  return (
    <div className={cn("mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 shadow-lg", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-full p-2">
            <Send className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Never miss a quiz!</p>
            <p className="text-white/80 text-xs">Daily challenges on Telegram</p>
          </div>
        </div>
        <Link
          href={TELEGRAM_CHANNEL_URL}
          target="_blank"
          className="bg-white text-purple-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors text-sm whitespace-nowrap"
        >
          Join Now
        </Link>
      </div>
    </div>
  );
};

export default TelegramCTA;
