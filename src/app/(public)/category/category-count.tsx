import { client } from "@/lib/orpc";

export async function CategoryCountSection() {
  const { categoryCount, subCategoryCount } = await client.getCategoryCounts();

  return (
    <div className="flex flex-wrap gap-3">
      <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm flex items-center gap-2">
        <span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">{categoryCount}</span>
        <span className="text-gray-600 dark:text-slate-400 text-sm font-medium">Categories</span>
      </div>
      <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm flex items-center gap-2">
        <span className="text-fuchsia-600 dark:text-fuchsia-400 font-bold text-lg">{subCategoryCount}</span>
        <span className="text-gray-600 dark:text-slate-400 text-sm font-medium">Subcategories</span>
      </div>
    </div>
  );
}

export function CategoryCountSkeleton() {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm flex items-center gap-2">
        <span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">--</span>
        <span className="text-gray-600 dark:text-slate-400 text-sm font-medium">Categories</span>
      </div>
      <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm flex items-center gap-2">
        <span className="text-fuchsia-600 dark:text-fuchsia-400 font-bold text-lg">--</span>
        <span className="text-gray-600 dark:text-slate-400 text-sm font-medium">Subcategories</span>
      </div>
    </div>
  );
}
