import { client } from "@/lib/orpc";
import { CategoryCardSkeleton } from "./category-card";
import { CategoryFilter } from "./category-filter";

export async function CategoryListSection() {
  const data = await client.getAllCategoriesWithStats();
  const categories = data.categories;

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="max-w-6xl">
        <CategoryFilter categories={categories} />
      </div>
    </section>
  );
}

export function CategoryListSkeleton() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="max-w-6xl grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
