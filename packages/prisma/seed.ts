import { PrismaClient } from "@quizzy/prisma/client";
import { kebabCase } from "es-toolkit";
import { categories } from "./categories";
import prisma from "@/lib/prisma";
type InputCategory = {
  category: string;
  subcategories: string[];
};

export async function seedCategory(input: InputCategory) {
  // 1) Upsert category (you can key by name or slug; both are unique)
  const category = await prisma.category.upsert({
    where: { name: input.category },
    update: {
      slug: kebabCase(input.category)
    },
    create: {
      name: input.category,
      slug: kebabCase(input.category)
    }
  });

  // 2) De-dup and normalize subcategory names
  const subNames = Array.from(new Set(input.subcategories.map((s) => s.trim())));

  // 3) Upsert each SubCategory using the compound unique: categoryId + name
  await Promise.all(
    subNames.map((name) =>
      prisma.subCategory.upsert({
        where: {
          // This matches your @@unique([categoryId, name]) → compound key name is "categoryId_name"
          categoryId_name: { categoryId: category.id, name }
        },
        update: {
          slug: kebabCase(name)
        },
        create: {
          name,
          slug: kebabCase(name),
          categoryId: category.id
        }
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
    await prisma.$disconnect();
  });
