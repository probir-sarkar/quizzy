import { z } from "zod";

export const QuizDoc = z
  .object({
    quizPageTitle: z
      .string()
      .min(3)
      .describe(
        "Catchy, SEO-friendly title for the quiz landing page (≤70 characters). Each output should be unique and not reuse generic wording."
      ),

    quizPageDescription: z
      .string()
      .min(20)
      .max(300)
      .describe(
        "Meta-style description (120–160 characters ideal). Write in plain text, no markdown, and vary style each generation."
      ),

    tags: z
      .array(
        z.string().describe("SEO tags/keywords, 1–3 words each. No '#' or emojis. Use fresh, diverse terms each time.")
      )
      .min(1)
      .max(10)
      .describe("1–10 tags that highlight the quiz topic, all plain text."),

    difficulty: z.enum(["easy", "medium", "hard"]).describe("Overall difficulty level of the quiz."),

    title: z
      .string()
      .describe(
        "On-page display title. Can mirror page title but must have slightly different phrasing to feel unique."
      ),

    description: z
      .string()
      .describe("Short description for the quiz page. Distinct from quizPageDescription. Plain text only."),

    questions: z
      .array(
        z.object({
          prompt: z.string().describe("The question text. Make it engaging and clear. Plain text only, no markdown."),

          options: z
            .array(z.string().describe("One possible answer choice, written in plain text. Provide 2–6 per question."))
            .min(2)
            .max(6)
            .describe("2–6 answer options for the question."),

          correctIndex: z
            .number()
            .int()
            .min(0)
            .describe("Index of the correct answer in the options array. Must match one of the provided options."),

          explanation: z
            .string()
            .optional()
            .describe("Optional short explanation (1–2 sentences). Unique phrasing each time, plain text only."),

          tags: z
            .array(
              z.string().describe("Optional tags specific to this question (topic, concept, etc.). Plain text only.")
            )
            .optional()
            .describe("Extra per-question tags, if needed.")
        })
      )
      .min(5)
      .max(10)
      .describe("Provide 5–10 multiple-choice questions. Each should feel unique and difficulty-appropriate.")
  })
  .describe(
    "Complete quiz object for a general audience. Must always be plain text, no markdown, and phrased uniquely each generation."
  );
