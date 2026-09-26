import { client } from "@/lib/orpc";
import { CategoryCardSkeleton } from "./category-card";
import { CategoryFilter } from "./category-filter";

export async function CategoryListSection() {
  const data = await client.getAllCategoriesWithStats();
  const categories = data.categories;

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
      <CategoryFilter categories={categories} />
    </section>
  );
}

export function CategoryListSkeleton() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 24 }).map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
