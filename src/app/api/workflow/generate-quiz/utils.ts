import prisma from "@/lib/prisma";

type Difficulty = "easy" | "medium" | "hard";

export function randomDifficulty(): Difficulty {
  const values: Difficulty[] = ["easy", "medium", "hard"];
  return values[Math.floor(Math.random() * values.length)];
}

export function randomCount(): number {
  return 5 + Math.floor(Math.random() * 11); // random int 5–15
}

export async function pickRandomSubCategory(): Promise<{
  category: { id: number; name: string };
  subCategory: { id: number; name: string };
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
    select: {
      id: true,
      name: true,
      subCategories: {
        select: { id: true, name: true }
      }
    }
  });

  if (!pickedCategory || pickedCategory.subCategories.length === 0) {
    throw new Error("Selected category has no subcategories (unexpected).");
  }

  const subIdx = Math.floor(Math.random() * pickedCategory.subCategories.length);
  const pickedSub = pickedCategory.subCategories[subIdx];

  return {
    category: { id: pickedCategory.id, name: pickedCategory.name },
    subCategory: { id: pickedSub.id, name: pickedSub.name }
  };
}

export interface QuizPromptOptions {
  categoryName: string;
  subCategoryName: string;
  difficulty: Difficulty;
  count: number;
}

export function generateQuizPrompt(options: QuizPromptOptions): string {
  const { categoryName, subCategoryName, difficulty, count } = options;

  return `
Create ONE complete, TEXT-ONLY, publish-ready quiz.
Category: ${categoryName}
Subcategory: ${subCategoryName}
Difficulty: ${difficulty}
Question count: ${count}

Hard rules:
- Provide "quizPageTitle", "quizPageDescription", "tags".
- "title"/"description" distinct from SEO fields.
- ${count} MCQs; each has 2–6 text options and a valid 0-based "correctIndex".
- Optional short "explanation".
- Plain text only; avoid markdown characters.
- Each question must have exactly one objectively correct answer.
- Questions should dive deep into ${subCategoryName}, not general ${categoryName} trivia.

Answer quality rules:
- Wrong options (distractors) must be plausible but clearly wrong to someone who knows the material.
- Include 1-2 "close but wrong" options based on common misconceptions.
- Avoid obviously joke answers or nonsensical options.
- Distractors should be similar length/complexity to the correct answer.
- Avoid "all of the above", "none of the above", "always", "never".
- Avoid time-sensitive references (current events, specific years).

Question variety:
- Mix of: direct questions, complete-the-statement, scenario-based, comparison.
- Not all true/false styled questions.
- Vary sentence length and structure across questions.

Uniqueness rules:
- Vary sentence length, verbs, and specificity across fields.
- Avoid repeating key nouns between title/description/prompts.
- Tags should be diverse, short, and non-redundant.

Return ONLY schema-valid JSON. No extra fields, no comments.
`;
}
