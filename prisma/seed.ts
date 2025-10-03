import { PrismaClient } from "@/generated/prisma/client";
import { kebabCase } from "es-toolkit";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    // Core Knowledge
    "General Knowledge",
    "Science & Nature",
    "Technology & Programming",
    "History",
    "Geography",
    "Sports",
    "Mathematics & Logic",
    "Mythology & Philosophy",

    // Entertainment & Lifestyle
    "Movies & TV",
    "Music",
    "Arts & Literature",
    "Food & Culture",
    "Entertainment",
    "Travel & Places",
    "Lifestyle & Hobbies",

    // Language & Skills
    "English Grammar",
    "Vocabulary Builder",
    "Idioms & Phrases",
    "Fun Facts",
    "Riddles & Brain Teasers"
  ];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, slug: kebabCase(name) }
    });
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
