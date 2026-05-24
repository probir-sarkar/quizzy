import { client } from "@/lib/orpc";
import { CategoryCard, CategoryCardSkeleton } from "./category-card";

export async function CategoryListSection() {
  const data = await client.getAllCategoriesWithStats();
  const categories = data.categories;

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="max-w-6xl">
        {categories.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No categories found</h3>
            <p className="text-gray-500 dark:text-gray-400">Check back later for new content</p>
          </div>
        )}
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
