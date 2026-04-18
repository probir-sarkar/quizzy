import prisma from "@/lib/prisma";

type Difficulty = "easy" | "medium" | "hard";

export function randomDifficulty(): Difficulty {
  const values: Difficulty[] = ["easy", "medium", "hard"];
  return values[Math.floor(Math.random() * values.length)] as Difficulty;
}

export function randomCount(): number {
  return 5 + Math.floor(Math.random() * 6); // random int 5–10
}

export async function pickRandomSubCategory(): Promise<{
  category: { id: number; name: string; slug: string };
  subCategory: { id: number; name: string; slug: string };
}> {
  const total = await prisma.category.count({
    where: { subCategories: { some: {} } }
  });

  if (total === 0) {
    throw new Error("No categories with subcategories found. Seed some data first.");
  }

  const skipCat = Math.floor(Math.random() * total);

  const pickedCategory = await prisma.category.findFirst({
    where: { subCategories: { some: {} } },
    skip: skipCat,
    orderBy: { id: "asc" },
    include: { subCategories: { select: { id: true, name: true, slug: true } } }
  });

  if (!pickedCategory || pickedCategory.subCategories.length === 0) {
    throw new Error("Selected category has no subcategories (unexpected).");
  }

  const subIdx = Math.floor(Math.random() * pickedCategory.subCategories.length);
  const pickedSub = pickedCategory.subCategories[subIdx];

  return { category: pickedCategory, subCategory: pickedSub };
}

export async function fetchExistingQuizTitles(
  categoryId: number,
  subCategoryId: number,
  take: number = 10
): Promise<
  Array<{
    title: string;
    quizPageTitle: string;
    description: string;
    quizPageDescription: string;
  }>
> {
  const existingQuizzes = await prisma.quiz.findMany({
    where: {
      categoryId,
      subCategoryId
    },
    select: {
      title: true,
      quizPageTitle: true,
      description: true,
      quizPageDescription: true
    },
    take
  });

  return existingQuizzes.map(
    (quiz: {
      title: string;
      quizPageTitle: string;
      description: string;
      quizPageDescription: string;
    }) => ({
    title: quiz.title,
    quizPageTitle: quiz.quizPageTitle,
    description: quiz.description,
    quizPageDescription: quiz.quizPageDescription
  }));
}

export interface QuizPromptOptions {
  categoryName: string;
  subCategoryName: string;
  difficulty: Difficulty;
  count: number;
  today: string;
  nonce: string;
  existingTitles: Array<{
    title: string;
    quizPageTitle: string;
    description: string;
    quizPageDescription: string;
  }>;
}

export function generateQuizPrompt(options: QuizPromptOptions): string {
  const { categoryName, subCategoryName, difficulty, count, today, nonce, existingTitles } = options;

  const existingTitlesText =
    existingTitles.length > 0
      ? existingTitles
          .map(
            (t, i) =>
              `${i + 1}. Title: "${t.title}" | Quiz Page Title: "${t.quizPageTitle}" | Description: "${t.description}"`
          )
          .join("\n")
      : "No existing titles in this category/subcategory";

  return `
Create ONE complete, TEXT-ONLY, publish-ready quiz.
Category: ${categoryName}
Subcategory: ${subCategoryName}
Difficulty: ${difficulty}
Question count: ${count}

Additional context (for freshness): Today is ${today}.
Nonce: ${nonce}

EXISTING TITLES TO AVOID (prevent duplicates and confusion):
${existingTitlesText}

Hard rules:
- Provide "quizPageTitle", "quizPageDescription", "tags".
- "title"/"description" distinct from SEO fields.
- ${count} MCQs; each has 2–6 text options and a valid 0-based "correctIndex".
- Optional short "explanation".
- Plain text only; avoid markdown characters.
- Each question must be objective and allow exactly one defensible correct option. Avoid opinion-based or preference-based wording.
- The quiz theme must clearly reflect both the category and subcategory.

Uniqueness rules:
- Vary sentence length, verbs, and specificity across fields.
- Avoid repeating key nouns between title/description/prompts.
- Tags should be diverse, short, and non-redundant.
- AVOID using similar titles or themes to the existing titles listed above.

Return ONLY schema-valid JSON. No extra fields, no comments.
`;
}
