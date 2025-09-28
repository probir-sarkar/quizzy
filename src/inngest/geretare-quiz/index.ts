import { inngest } from "../client";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import prisma from "@/lib/prisma";
import { kebabCase } from "es-toolkit";
import { QuizDoc } from "./schema";

function randomDifficulty(): "easy" | "medium" | "hard" {
  const values = ["easy", "medium", "hard"] as const;
  return values[Math.floor(Math.random() * values.length)];
}

function randomCount(): number {
  return Math.floor(Math.random() * (10 - 5 + 1)) + 5; // 5–10
}

export const generateQuizFn = inngest.createFunction(
  { id: "generate-quiz-merged" },
  { event: "quiz/generate.requested" },
  async ({ step }) => {
    const difficulty = randomDifficulty();
    const count = randomCount();

    const category = await step.run("get-random-category", async () => {
      const categories = await prisma.category.findMany();
      return categories[Math.floor(Math.random() * categories.length)];
    });

    // STEP 1: Generate quiz JSON
    const { object: quizDoc } = await step.run("generate-quiz-json", async () =>
      generateObject({
        model: google("gemini-2.5-flash-lite"),
        schema: QuizDoc,
        system: "Return strict JSON only. No markdown, no prose outside JSON.",
        prompt: `
Create ONE complete, publish-ready quiz for a general audience.
Category: ${category.name}

Hard rules:
- Be catchy/interesting/funny but accessible.
- SEO-friendly: provide 'quizPageTitle', 'quizPageDescription',, 'tags'.
- The quiz must be TEXT-ONLY (no images/audio).
- Difficulty: ${difficulty}.
- Provide ${count} MCQ questions.
- Each question has 2–6 text options and a valid 'correctIndex'.
- Short explanations are okay (optional).
- 'title'/'description' can mirror the SEO fields or be concise display copies.

Return ONLY JSON that matches the schema.
        `,
        providerOptions: {
          google: { structuredOutputs: true, temperature: 0.65 }
        }
      })
    );

    // STEP 2: Save quiz in DB
    const savedQuiz = await step.run("save-quiz-db", async () =>
      prisma.quiz.create({
        data: {
          quizPageTitle: quizDoc.quizPageTitle,
          quizPageDescription: quizDoc.quizPageDescription,
          categoryId: category.id,
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
    );

    return { quiz: savedQuiz };
  }
);
