import { inngest } from "../client";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText, Output } from "ai";
import prisma from "@/lib/prisma";
import { kebabCase } from "es-toolkit";
import { QuizDoc } from "./schema";
import { format } from "date-fns";
import { NonRetriableError } from "inngest";
import { model } from "@/lib/ai-models";

type Difficulty = "easy" | "medium" | "hard";

function randomDifficulty(): Difficulty {
  const values: Difficulty[] = ["easy", "medium", "hard"];
  return values[Math.floor(Math.random() * values.length)];
}

function randomCount(): number {
  return 5 + Math.floor(Math.random() * 6); // random int 5–10
}

export const generateQuizFn = inngest.createFunction(
  { id: "generate-quiz", retries: 0 },
  [{ event: "quiz/generate-quiz" }, { cron: "0 * * * *" }],
  async ({ step }) => {
    const today = format(new Date(), "MMMM d, yyyy");
    const nonce = `${today}-${Math.random().toString(36).slice(2)}`;
    const difficulty = randomDifficulty();
    const count = randomCount();

    // STEP 0: Pick a random Category *that has subcategories*, then a random SubCategory
    const { category, subCategory } = await step.run("pick-random-category-and-sub", async () => {
      // Only consider categories that have at least one subcategory
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
        orderBy: { id: "asc" }, // deterministic base ordering
        include: { subCategories: { select: { id: true, name: true, slug: true } } }
      });
      if (!pickedCategory || pickedCategory.subCategories.length === 0) {
        throw new Error("Selected category has no subcategories (unexpected).");
      }

      const subIdx = Math.floor(Math.random() * pickedCategory.subCategories.length);
      const pickedSub = pickedCategory.subCategories[subIdx];

      return { category: pickedCategory, subCategory: pickedSub };
    });

    // STEP 0.5: Fetch existing titles to avoid duplicates
    const { existingTitles } = await step.run("fetch-existing-titles", async () => {
      const existingQuizzes = await prisma.quiz.findMany({
        where: {
          categoryId: category.id,
          subCategoryId: subCategory.id
        },
        select: {
          title: true,
          quizPageTitle: true,
          description: true,
          quizPageDescription: true
        },
        take: 10 // Get recent titles to avoid
      });

      return {
        existingTitles: existingQuizzes.map((quiz) => ({
          title: quiz.title,
          quizPageTitle: quiz.quizPageTitle,
          description: quiz.description,
          quizPageDescription: quiz.quizPageDescription
        }))
      };
    });

    // STEP 1: Generate quiz JSON
    const quizDoc = await step.run("generate-quiz-json", async () => {
      const result = await generateText({
        model: model,
        output: Output.object({
          schema: QuizDoc
        }),
        system: `Strict JSON only. No markdown. No extra commentary.`,
        prompt: `
Create ONE complete, TEXT-ONLY, publish-ready quiz.
Category: ${category.name}
Subcategory: ${subCategory.name}
Difficulty: ${difficulty}
Question count: ${count}

Additional context (for freshness): Today is ${today}.
Nonce: ${nonce}

EXISTING TITLES TO AVOID (prevent duplicates and confusion):
${
  existingTitles.length > 0
    ? existingTitles
        .map(
          (t, i) =>
            `${i + 1}. Title: "${t.title}" | Quiz Page Title: "${t.quizPageTitle}" | Description: "${t.description}"`
        )
        .join("\n")
    : "No existing titles in this category/subcategory"
}

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
`
      });
      return result.output;
    });
    // STEP 2: Save quiz in DB
    const savedQuiz = await step
      .run("save-quiz-db", async () =>
        prisma.quiz.create({
          data: {
            quizPageTitle: quizDoc.quizPageTitle,
            quizPageDescription: quizDoc.quizPageDescription,
            categoryId: category.id,
            subCategoryId: subCategory.id,
            tags: {
              create: quizDoc.tags.map((name) => ({
                tag: {
                  connectOrCreate: {
                    where: { name },
                    create: { name }
                  }
                }
              }))
            },

            difficulty: quizDoc.difficulty,
            title: quizDoc.title,
            description: quizDoc.description,
            slug: kebabCase(quizDoc.quizPageTitle),
            isPublished: false,
            questions: {
              create: quizDoc.questions.map((q) => ({
                text: q.prompt,
                options: q.options,
                correctIndex: q.correctIndex,
                explanation: q.explanation ?? null
              }))
            }
          },
          include: { questions: true }
        })
      )
      .catch((err) => {
        throw new NonRetriableError(err);
      });

    return { quiz: savedQuiz };
  }
);
