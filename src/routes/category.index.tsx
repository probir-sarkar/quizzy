import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { CategorySkeleton } from "@/components/route-fallbacks/category-skeleton";
import { CategoryFilter } from "@/components/category/category-filter";
import { Reveal } from "@/components/motion/reveal";
import { BASE_URL } from "@/lib/constants";
import { client } from "@/lib/orpc";

export const Route = createFileRoute("/category/")({
  loader: async () => {
    const [counts, allCategories] = await Promise.all([
      client.getCategoryCounts(),
      client.getAllCategoriesWithStats()
    ]);
    return { counts, categories: allCategories.categories };
  },
  pendingComponent: CategorySkeleton,
  head: () => ({
    meta: [
      { title: "All Quiz Categories - Quizzy" },
      {
        name: "description",
        content:
          "Explore all quiz categories and test your knowledge across various topics. From science to pop culture, find quizzes that match your interests and challenge yourself."
      },
      { property: "og:title", content: "All Quiz Categories - Quizzy" },
      { property: "og:site_name", content: "Quizzy" },
      { property: "og:type", content: "website" }
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}/category` }]
  }),
  component: CategoriesPage
});

function CategoriesPage() {
  const { counts, categories } = Route.useLoaderData();

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="border-b-2 border-foreground">
        <div className="mx-auto max-w-[1400px] px-4 pt-28 pb-12 sm:px-6 md:pt-36">
          <Reveal y={12}>
            <Link
              to="/"
              className="group inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to home
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
              The full index
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-3 font-sans text-5xl font-black uppercase leading-[0.9] tracking-[-0.02em] sm:text-7xl lg:text-8xl">
              All <span className="border-b-8 border-lime-300">Categories</span>
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
              From science to pop culture — pick a shelf, start pulling books down. Every category keeps its own
              scoreboard.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="rule-dotted mt-8 flex gap-12 pt-6">
              <StatBlock value={counts.categoryCount} label="Categories" />
              <StatBlock value={counts.subCategoryCount} label="Subcategories" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
        <CategoryFilter categories={categories} />
      </section>
    </main>
  );
}

function StatBlock({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <span className="block font-sans text-5xl font-black tabular-nums sm:text-6xl">{value}</span>
      <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
    </div>
  );
}
