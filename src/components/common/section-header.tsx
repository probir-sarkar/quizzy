import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";

function SectionHeader({ id, title }: { id: string; title: string }) {
  return (
    <Reveal>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4" aria-labelledby={`${id}-title`}>
        <h2
          id={`${id}-title`}
          className="border-b-4 border-lime-300 font-sans text-3xl font-black uppercase tracking-tight sm:text-5xl"
        >
          {title}
        </h2>

        <Link
          href={`/category/${id}`}
          className="group inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] underline-offset-4 hover:underline"
          aria-label={`Link to ${title}`}
        >
          <span>Everything in {title}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </header>
    </Reveal>
  );
}

export default SectionHeader;
