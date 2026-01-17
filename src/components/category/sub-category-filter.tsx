"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSearchParams, usePathname } from "next/navigation";

type Props = {
  subCategories: { name: string; slug: string; count: number }[];
};

export default function SubCategoryFilters({ subCategories }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentSub = searchParams.get("subcategory");

  // Re-order: selected subcategory first (after "All")
  const orderedSubs = [...subCategories];
  if (currentSub) {
    const selectedIndex = orderedSubs.findIndex((c) => c.slug === currentSub);
    if (selectedIndex > -1) {
      const [selected] = orderedSubs.splice(selectedIndex, 1);
      orderedSubs.unshift(selected);
    }
  }

  // Build URL with updated query param
  const buildHref = (slug?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("subcategory", slug);
    else params.delete("subcategory");
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="px-4 mt-6 container mx-auto">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* All option */}
        <Link href={buildHref()} scroll={false}>
          <Badge
            className={cn(
              "px-4 py-2 rounded-full whitespace-nowrap cursor-pointer",
              "inline-flex items-center gap-2",
              "text-gray-700 dark:text-gray-300",
              "bg-white dark:bg-gray-800",
              "border border-gray-200/70 dark:border-gray-700 shadow-sm",
              "transition-all duration-300 ease-out",
              "hover:bg-gradient-to-r hover:from-violet-500 hover:to-fuchsia-600 hover:text-white hover:shadow-lg",
              "active:scale-95",
              !currentSub &&
                "bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white shadow-lg"
            )}
          >
            All
          </Badge>
        </Link>

        {/* Subcategories */}
        {orderedSubs.map((cat) => (
          <Link key={cat.slug} href={buildHref(cat.slug)} scroll={false}>
            <Badge
              className={cn(
                "px-4 py-2 rounded-full whitespace-nowrap cursor-pointer",
                "inline-flex items-center gap-2",
                "text-gray-700 dark:text-gray-300",
                "bg-white dark:bg-gray-800",
                "border border-gray-200/70 dark:border-gray-700 shadow-sm",
                "transition-all duration-300 ease-out",
                "hover:bg-gradient-to-r hover:from-violet-500 hover:to-fuchsia-600 hover:text-white hover:shadow-lg",
                "active:scale-95",
                currentSub === cat.slug &&
                  "bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white shadow-lg"
              )}
            >
              <span>{cat.name}</span>
              <span className="text-xs opacity-70">({cat.count})</span>
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
