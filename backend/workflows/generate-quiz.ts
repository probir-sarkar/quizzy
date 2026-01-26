import { WorkflowEntrypoint, WorkflowStep } from "cloudflare:workers";
import type { WorkflowEvent } from "cloudflare:workers";
import { Env } from "hono";
import { getPrisma } from "../lib/prisma";
import { generateText, Output } from "ai";
import { getOpenAI } from "../lib/ai-models";
import { QuizDoc } from "./schemas/quiz-schema";
import { kebabCase } from "es-toolkit";

interface Params {
  // Add any workflow parameters here if needed
}
type Difficulty = "easy" | "medium" | "hard";

function randomDifficulty(): Difficulty {
  const values: Difficulty[] = ["easy", "medium", "hard"];
  return values[Math.floor(Math.random() * values.length)];
}

function randomCount(): number {
  return 5 + Math.floor(Math.random() * 6); // random int 5–10
}

export class GenerateQuizWorkflow extends WorkflowEntrypoint<Env, Params> {
  async run(_event: WorkflowEvent<Params>, step: WorkflowStep) {
    const prisma = getPrisma();
    const model = getOpenAI();
    const difficulty = randomDifficulty();
    const count = randomCount();
    const { category, subCategory } = await step.do(
      "pick-random-category-and-sub",

      async () => {
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
      }
    );

    const { existingTitles } = await step.do(
      "fetch-existing-titles",

      async () => {
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
      }
    );

    const quizDoc = await step.do(
      "generate-quiz-json",
      async () => {
        const result = await generateText({
          model: model,
          output: Output.object({ schema: QuizDoc }),
          system: "JSON output only. No markdown.",
          prompt: `Category: ${category.name} | Subcategory: ${subCategory.name} | Difficulty: ${difficulty} | Questions: ${count}

Avoid these titles:
${existingTitles.map((t) => `• ${t.quizPageTitle}`).join("\n") || "• None"}

Requirements:
• quizPageTitle: catchy, unique, ≤70 chars
• quizPageDescription: meta style, 120-160 chars
• title: on-page heading, different phrasing
• description: brief 1-line summary, 20-50 chars
• tags: 3-6 relevant keywords
• questions: ${count} objective MCQs with 2-6 options, correctIndex 0-based
• All plain text, no markdown

Return valid JSON.`
        });
        return result.output;
      }
    );
    await step.do("save-quiz-db", async () =>
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
        }
      })
    );
  }
}
