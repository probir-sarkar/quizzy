import { z } from "zod";
export const QuizDoc = z.object({
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
        tags: z.array(z.string()).optional()
      })
    )
    .min(5)
    .max(10)
});
