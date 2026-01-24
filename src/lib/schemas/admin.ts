import { z } from "zod";

export const QuestionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, "Question text is required"),
  options: z.array(z.string().min(1)).min(2, "At least 2 options required").max(6, "Maximum 6 options"),
  correctIndex: z.number().int().min(0).max(5),
  explanation: z.string().optional(),
});

export const QuizFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  quizPageTitle: z.string().min(1, "Quiz page title is required").max(200),
  quizPageDescription: z.string().min(10, "Quiz page description must be at least 10 characters"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  categoryId: z.string().optional(),
  subCategoryId: z.string().optional(),
  tagIds: z.array(z.number()).optional(),
  questions: z.array(QuestionSchema).min(1, "At least one question is required"),
  isPublished: z.boolean().default(false),
});

export const CategoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
});

export const TagFormSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(50),
});

export type QuizFormData = z.infer<typeof QuizFormSchema>;
export type QuestionFormData = z.infer<typeof QuestionSchema>;
export type CategoryFormData = z.infer<typeof CategoryFormSchema>;
export type TagFormData = z.infer<typeof TagFormSchema>;
