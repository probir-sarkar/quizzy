import { inngest } from "./client";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import prisma from "@/lib/prisma";

/** Single, merged schema: idea + quiz */
const QuizDoc = z.object({
  quizPageTitle: z.string().min(3),
  quizPageDescription: z.string().min(20).max(300),
  category: z.string().min(3),
  tags: z.array(z.string()).min(1).max(10),
  difficulty: z.enum(["easy", "medium", "hard"]),
  title: z.string(),
  description: z.string(),
  questions: z
    .array(
      z.object({
        id: z.string(),
        prompt: z.string(),
        options: z.array(z.string()).min(2).max(6),
        correctIndex: z.number().int().min(0),
        explanation: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .min(5)
    .max(10),
});

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

    // STEP 1: Generate quiz JSON
    const { object: quizDoc } = await step.run("generate-quiz-json", async () =>
      generateObject({
        model: google("gemini-2.5-flash-lite"),
        schema: QuizDoc,
        system: "Return strict JSON only. No markdown, no prose outside JSON.",
        prompt: `
Create ONE complete, publish-ready quiz for a general audience.

Hard rules:
- Be catchy/interesting/funny but accessible.
- SEO-friendly: provide 'quizPageTitle', 'quizPageDescription', 'category', 'tags'.
- The quiz must be TEXT-ONLY (no images/audio).
- Difficulty: ${difficulty}.
- Provide ${count} MCQ questions.
- Each question has 2–6 text options and a valid 'correctIndex'.
- Short explanations are okay (optional).
- 'title'/'description' can mirror the SEO fields or be concise display copies.

Return ONLY JSON that matches the schema.
        `,
        providerOptions: {
          google: { structuredOutputs: true, temperature: 0.65 },
        },
      })
    );

    // STEP 2: Save quiz in DB
    const savedQuiz = await step.run("save-quiz-db", async () =>
      prisma.quiz.create({
        data: {
          quizPageTitle: quizDoc.quizPageTitle,
          quizPageDescription: quizDoc.quizPageDescription,
          category: quizDoc.category,
          tags: quizDoc.tags,
          difficulty: quizDoc.difficulty,
          title: quizDoc.title,
          description: quizDoc.description,
          slug: quizDoc.quizPageTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, ""),
          isPublished: false,
          questions: {
            create: quizDoc.questions.map((q) => ({
              prompt: q.prompt,
              options: q.options,
              correctIndex: q.correctIndex,
              explanation: q.explanation ?? null,
              tags: q.tags ?? [],
            })),
          },
        },
        include: { questions: true },
      })
    );

    return { quiz: savedQuiz };
  }
);
