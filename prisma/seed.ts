import { kebabCase } from "es-toolkit";
import { categories } from "./categories";
import { db } from "@/lib/prisma";
type InputCategory = {
  category: string;
  subcategories: string[];
};

export async function seedCategory(input: InputCategory) {
  // 1) Upsert category (you can key by name or slug; both are unique)
  const category = await db.orm.public.Category.upsert({
    create: {
      name: input.category,
      slug: kebabCase(input.category)
    },
    update: {
      slug: kebabCase(input.category)
    },
    conflictOn: { name: input.category }
  });

  // 2) De-dup and normalize subcategory names
  const subNames = Array.from(new Set(input.subcategories.map((s) => s.trim())));

  // 3) Upsert each SubCategory using the compound unique: categoryId + name
  await Promise.all(
    subNames.map((name) =>
      db.orm.public.SubCategory.upsert({
        create: {
          name,
          slug: kebabCase(name),
          categoryId: category.id
        },
        update: {
          slug: kebabCase(name)
        },
        conflictOn: { categoryId: category.id, name }
      })
    )
  );
}
async function main() {
  for (const category of categories) {
    await seedCategory(category);
    console.log(`✅ ${category.category} seeded successfully!`);
  }

  console.log("✅ Expanded text-only MCQ categories seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.close();
  });
