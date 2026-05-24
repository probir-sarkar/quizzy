import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  category: {
    id: number;
    name: string;
    slug: string;
    _count: {
      quizzes: number;
      subCategories: number;
    } | null;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  const quizCount = category._count?.quizzes ?? 0;
  const subCategoryCount = category._count?.subCategories ?? 0;

  return (
    <Link
      href={`/category/${category.slug}`}
      prefetch
      className="group block rounded-xl border border-gray-200/60 dark:border-gray-800/60 bg-linear-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-950/50 p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-gray-50 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">
          {category.name}
        </h3>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 group-hover:translate-x-0.5 transition-all" />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        {quizCount} quiz{quizCount !== 1 ? "zes" : ""}
        {subCategoryCount > 0 && ` · ${subCategoryCount} subcategories`}
      </p>
    </Link>
  );
}
