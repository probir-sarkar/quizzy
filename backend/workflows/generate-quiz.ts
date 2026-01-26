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
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    const prisma = getPrisma();
    const model = getOpenAI();
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const nonce = `${today}-${Math.random().toString(36).slice(2)}`;
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
          model,
          temperature: 0.4,
          output: Output.object({ schema: QuizDoc }),

          system: `
You are a JSON generator for a production system.
You MUST output ONLY valid JSON matching the provided schema.
DO NOT include explanations, reasoning, markdown, comments, or extra keys.
If unsure, make a best valid guess and still return JSON.
`,

          prompt: `
TASK:
Generate exactly ONE complete quiz object.

CONTEXT:
Category: ${category.name}
Subcategory: ${subCategory.name}
Difficulty: ${difficulty}
Question count: ${count}
Date: ${today}
Nonce: ${nonce}

DUPLICATION AVOIDANCE:
Do NOT reuse or closely resemble any of the following titles, descriptions, or themes:
${
  existingTitles.length
    ? existingTitles.map((t, i) => `${i + 1}. "${t.title}" | "${t.quizPageTitle}" | "${t.description}"`).join("\n")
    : "None"
}

STRICT RULES:
- Output ONLY JSON, no surrounding text
- Must match the schema exactly
- No markdown, no bullet points, no emojis
- No references to AI, model, or instructions
- No meta language like "this quiz" or "in this quiz"
- No placeholders or TODO text
- No repeated sentences across fields
- Keep all text natural, human, and publish-ready

QUIZ RULES:
- quizPageTitle: SEO-friendly, unique, ≤70 chars
- quizPageDescription: 120–160 chars, varied tone
- title: different phrasing from quizPageTitle
- description: different phrasing from both titles
- tags: 1–10 short, non-redundant keywords
- questions: exactly ${count} items
- each question:
  - objective, factual, single correct answer
  - 2–6 options
  - correctIndex must match options
  - no opinion-based wording
  - optional explanation (1–2 sentences, plain text)

STYLE RULES:
- Vary sentence structure across fields
- Avoid repeating the same nouns everywhere
- Use precise, concrete wording
- Sound like a professional educational product
- Ensure topic clearly matches category + subcategory

FINAL CHECK:
Return ONLY schema-valid JSON.
No extra fields. No comments. No explanations.
`
        });
        return result.output;
      }
    );
    // STEP 2: Save quiz in DB
    const savedQuiz = await step.do(
      "save-quiz-db",

      async () =>
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
