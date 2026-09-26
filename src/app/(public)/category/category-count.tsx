import { client } from "@/lib/orpc";

export async function CategoryCountSection() {
  const { categoryCount, subCategoryCount } = await client.getCategoryCounts();

  return (
    <div className="flex gap-12">
      <StatBlock value={categoryCount} label="Categories" />
      <StatBlock value={subCategoryCount} label="Subcategories" />
    </div>
  );
}

export function CategoryCountSkeleton() {
  return (
    <div className="flex gap-12">
      <StatBlock value="--" label="Categories" skeleton />
      <StatBlock value="--" label="Subcategories" skeleton />
    </div>
  );
}

function StatBlock({ value, label, skeleton = false }: { value: number | string; label: string; skeleton?: boolean }) {
  return (
    <div>
      <span
        className={`block font-sans text-5xl font-black tabular-nums sm:text-6xl ${skeleton ? "animate-pulse bg-muted text-transparent" : ""}`}
      >
        {value}
      </span>
      <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
    </div>
  );
}
