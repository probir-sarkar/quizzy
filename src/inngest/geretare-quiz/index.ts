import { inngest } from "../client";
import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import prisma from "@/lib/prisma";
import { kebabCase } from "es-toolkit";
import { QuizDoc } from "./schema";
import { format } from "date-fns";

const today = format(new Date(), "MMMM d, yyyy");
const nonce = `${today}-${Math.random().toString(36).slice(2)}`;

type Difficulty = "easy" | "medium" | "hard";

const difficultyModelMap: Record<Difficulty, string> = {
  easy: "meta-llama/llama-4-scout-17b-16e-instruct",
  medium: "meta-llama/llama-4-maverick-17b-128e-instruct",
  hard: "openai/gpt-oss-120b"
};

function randomDifficulty(): Difficulty {
  const values: Difficulty[] = ["easy", "medium", "hard"];
  return values[Math.floor(Math.random() * values.length)];
}

function randomCount(): number {
  return 5 + Math.floor(Math.random() * 6); // random int 5–10
}

export const generateQuizFn = inngest.createFunction(
  { id: "generate-quiz", retries: 2 },
  [{ event: "test/generate-quiz" }, { cron: "0 */1 * * *" }],
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
        model: groq(difficultyModelMap[difficulty]),
        schema: QuizDoc,
        system: `Strict JSON only. No markdown. No extra commentary.`,
        prompt: `
Create ONE complete, TEXT-ONLY, publish-ready quiz.
Category: ${category.name}
Difficulty: ${difficulty}
Question count: ${count}

Additional context (for freshness): Today is ${today}.
Nonce: ${nonce}

Hard rules:
- Provide "quizPageTitle", "quizPageDescription", "tags".
- "title"/"description" distinct from SEO fields.
- ${count} MCQs; each has 2–6 text options and a valid 0-based "correctIndex".
- Optional short "explanation".
- Plain text only; avoid markdown characters.
- Each question must be objective and allow exactly one defensible correct option. Avoid opinion-based or preference-based wording.

Uniqueness rules:
- Vary sentence length, verbs, and specificity across fields.
- Avoid repeating key nouns between title/description/prompts.
- Tags should be diverse, short, and non-redundant.

Return ONLY schema-valid JSON. No extra fields, no comments.
`
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
