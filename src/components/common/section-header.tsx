import { Link as LinkIcon, ChevronRight } from "lucide-react";
import Link from "next/link";

function SectionHeader({ id, title }: { id: string; title: string }) {
  return (
    <header className="mb-8 flex items-end justify-between px-4 sm:px-0" aria-labelledby={`${id}-title`}>
      <div className="space-y-1">
        <h2 id={`${id}-title`} className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        <div className="h-1.5 w-12 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-600" />
      </div>

      <Link
        href={`/category/${id}`}
        className="group inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest
                   text-slate-600 dark:text-slate-400
                   bg-white/5 backdrop-blur-md
                   hover:bg-violet-600 hover:text-white hover:border-violet-500 transition-all duration-300"
        aria-label={`Link to ${title}`}
      >
        <span>Explore All</span>
        <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
      </Link>
    </header>
  );
}

export default SectionHeader;
