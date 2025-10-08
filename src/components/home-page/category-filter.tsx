import { Badge } from "@/components/ui/badge";
import { getCategories } from "@/queries/home-page";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function CategoryFilters() {
  const categories = await getCategories();

  const badgeStyles = cn(
    "px-4 py-2 rounded-full whitespace-nowrap cursor-pointer",
    "text-gray-700 dark:text-gray-300",
    "bg-white dark:bg-gray-800",
    "border border-gray-200/70 dark:border-gray-700 shadow-sm",
    "transition-all duration-300 ease-out",
    "hover:bg-gradient-to-r hover:from-violet-500 hover:to-fuchsia-600",
    "hover:text-white hover:shadow-lg",
    "active:scale-95"
  );

  return (
    <div className="px-4 mt-6 container mx-auto">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Link href="/category" prefetch scroll={false}>
          <Badge className={badgeStyles}>All</Badge>
        </Link>

        {categories.map((cat) => (
          <Link key={cat.slug} href={`/category/${cat.slug}`} prefetch>
            <Badge className={badgeStyles}>{cat.name}</Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
