import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";

function SectionHeader({ id, title }: { id: string; title: string }) {
  return (
    <header className="mb-4 flex items-center justify-between" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="text-xl font-medium tracking-tight text-neutral-700 dark:text-neutral-100">
        {title}
      </h2>

      <Link
        href={`/category/${id}`}
        className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs
                   text-neutral-600 dark:text-neutral-300
                   border-neutral-200 dark:border-neutral-700
                   hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
        aria-label={`Link to ${title}`}
        title={id}
      >
        <LinkIcon className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">View all</span>
      </Link>
    </header>
  );
}

export default SectionHeader;
