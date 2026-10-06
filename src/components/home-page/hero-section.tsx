import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowDownRight } from "lucide-react";
import { CountUp } from "@/components/motion/count-up";
import Marquee from "@/components/common/marquee";

interface HeroSectionProps {
  totalQuizzes?: number;
  totalCategories?: number;
  totalSubCategories?: number;
}

const TICKER_ITEMS = [
  "General Knowledge",
  "Science",
  "Movies",
  "Music",
  "History",
  "Sports",
  "Geography",
  "Literature",
  "Technology",
  "Food",
  "Mythology",
  "Video Games"
];

const HeroSection = ({ totalQuizzes = 0, totalCategories = 0, totalSubCategories = 0 }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });

  // Tracking parallax — the headline drifts up slowly while the specimen card
  // sinks and straightens out. Subtle on purpose.
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -48]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 56]);
  const cardRotate = useTransform(scrollYProgress, [0, 1], [3, reduce ? 3 : -1.5]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-b-2 border-foreground">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-4 pt-32 pb-14 sm:px-6 md:pt-40 lg:grid-cols-12 lg:gap-6">
        {/* Headline */}
        <motion.div style={{ y: headlineY }} className="lg:col-span-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground"
          >
            Issue Nº 001 — The trivia broadsheet
          </motion.p>

          <h1 className="font-sans font-black uppercase leading-[0.86] tracking-[-0.03em]">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="block text-[17vw] sm:text-[13vw] lg:text-[8.5rem] xl:text-[10rem]"
            >
              Know
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="block text-[17vw] sm:text-[13vw] lg:text-[8.5rem] xl:text-[10rem]"
            >
              <span className="font-mono font-bold normal-case italic tracking-tight">it</span> all
              <span className="text-muted-foreground/60">?</span>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-7 max-w-md font-sans text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Thousands of hand-written questions, zero AI slop. Pick a category, keep honest score, and argue
            about the answers afterwards.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="#trending"
              className="pop-hover inline-flex items-center gap-2 border-2 border-foreground bg-foreground px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-background shadow-pop [--pop:var(--pop-lime)]"
            >
              Start Playing
              <ArrowDownRight className="h-4 w-4" />
            </a>
            <a
              href="#categories"
              className="pop-hover inline-flex items-center gap-2 border-2 border-foreground bg-background px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.16em] shadow-pop [--pop:var(--pop-violet)] hover:bg-foreground hover:text-background"
            >
              Browse Categories
            </a>
          </motion.div>
        </motion.div>

        {/* Specimen card — typographic object instead of a stock photo */}
        <motion.div style={{ y: cardY }} className="flex items-center justify-center lg:col-span-4">
          <motion.figure
            initial={{ opacity: 0, rotate: 8, scale: 0.9 }}
            animate={{ opacity: 1, rotate: 3, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ rotate: cardRotate }}
            className="relative w-64 border-2 border-foreground bg-card p-5 shadow-pop select-none [--pop:var(--pop-violet)] [--pop-x:10px] [--pop-y:10px] sm:w-72"
          >
            <figcaption className="mb-3 flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
              <span>Fig. 01</span>
              <span>Your brain</span>
            </figcaption>
            <div className="flex items-center justify-center border-2 border-dashed border-foreground/40 py-10">
              <span className="font-sans text-[9rem] leading-none font-black">?</span>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <p className="font-mono text-[10px] leading-relaxed uppercase tracking-[0.2em] text-muted-foreground">
                Input:
                <br />
                Curiosity
              </p>
              <span className="bg-halftone text-foreground/50 h-10 w-16" aria-hidden />
            </div>
          </motion.figure>
        </motion.div>
      </div>

      {/* Stats strip */}
      <div className="border-t-2 border-foreground">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 divide-y-2 divide-dotted divide-foreground/40 border-foreground sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
          <HeroStat label="Quizzes in the archive" value={totalQuizzes} />
          <HeroStat label="Categories" value={totalCategories} />
          <HeroStat label="Sub-topics" value={totalSubCategories} />
        </div>
      </div>

      {/* Ticker */}
      <Marquee duration={48} className="border-t-2 border-foreground bg-foreground py-3 text-background">
        {TICKER_ITEMS.map((item) => (
          <span key={item} className="mx-5 flex items-center gap-10 font-mono text-xs font-bold uppercase tracking-[0.3em]">
            {item}
            <span aria-hidden className="text-base leading-none">✷</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
};

function HeroStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-center gap-3 px-6 py-6 sm:flex-col sm:items-start sm:gap-1">
      <CountUp value={value} suffix="+" className="font-sans text-4xl font-black tracking-tight tabular-nums sm:text-5xl" />
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export default HeroSection;
