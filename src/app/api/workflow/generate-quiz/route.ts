import { serve } from "@upstash/workflow/nextjs";
import { extractJsonMiddleware, generateText, Output, wrapLanguageModel } from "ai";
import { randomUUID } from "node:crypto";
import { db, asTimestamp } from "@/lib/prisma";
import { kebabCase } from "es-toolkit";
import { QuizDoc } from "@/app/api/workflow/generate-quiz/schema";
import { model } from "@/lib/ai-models";
import {
  randomDifficulty,
  randomCount,
  pickRandomSubCategory,
  generateQuizPrompt
} from "@/app/api/workflow/generate-quiz/utils";
import { WorkflowNonRetryableError } from "@upstash/workflow";

export const { POST } = serve(async (context) => {
  const generationResult = await context.run("generate-quiz", async () => {
    try {
      const difficulty = randomDifficulty();
      const count = randomCount();
      const selected = await pickRandomSubCategory();

      const result = await generateText({
        model: wrapLanguageModel({
          model: model,
          middleware: extractJsonMiddleware()
        }),
        output: Output.object({
          schema: QuizDoc
        }),
        prompt: generateQuizPrompt({
          categoryName: selected.category.name,
          subCategoryName: selected.subCategory.name,
          difficulty,
          count
        })
      });

      return {
        categoryId: selected.category.id,
        subCategoryId: selected.subCategory.id,
        quizDoc: result.output
      };
    } catch (error) {
      console.error("Quiz generation error:", error);
      throw new WorkflowNonRetryableError(
        `Quiz generation failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  });

  await context.run("save-quiz", async () => {
    try {
      const { categoryId, subCategoryId, quizDoc } = generationResult;

      await db.transaction(async (tx) => {
        // Quiz.id has no client-side default in the v8 contract and updatedAt
        // has no DB default, so both are supplied explicitly.
        const quiz = await tx.orm.public.Quiz.create({
          id: randomUUID(),
          updatedAt: asTimestamp(new Date()),
          quizPageTitle: quizDoc.quizPageTitle,
          quizPageDescription: quizDoc.quizPageDescription,
          categoryId,
          subCategoryId,
          difficulty: quizDoc.difficulty,
          title: quizDoc.title,
          description: quizDoc.description,
          slug: kebabCase(quizDoc.quizPageTitle),
          isPublished: false
        });

        await tx.orm.public.Question.createAll(
          quizDoc.questions.map((q) => ({
            id: randomUUID(),
            quizId: quiz.id,
            text: q.prompt,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation ?? null
          }))
        );

        // Quiz↔Tag is a junction table (QuizTag); v8 has no N:M nested
        // mutations, so tags are upserted and linked explicitly.
        const tags = await Promise.all(
          quizDoc.tags.map((name) =>
            tx.orm.public.Tag.upsert({
              create: { name },
              update: {},
              conflictOn: { name }
            })
          )
        );

        await tx.orm.public.QuizTag.createAll(
          tags.map((tag) => ({ quizId: quiz.id, tagId: tag.id }))
        );

        return quiz;
      });
    } catch (error) {
      // Stop execution gracefully without error
      await context.cancel();
      return;
    }
  });
});
