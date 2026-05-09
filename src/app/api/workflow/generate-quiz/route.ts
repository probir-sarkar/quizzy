import { serve } from "@upstash/workflow/nextjs";
import { generateText, Output } from "ai";
import prisma from "@/lib/prisma";
import { kebabCase } from "es-toolkit";
import { QuizDoc } from "@/app/api/workflow/generate-quiz/schema";
import { format } from "date-fns";
import { model } from "@/lib/ai-models";
import {
  randomDifficulty,
  randomCount,
  pickRandomSubCategory,
  fetchExistingQuizTitles,
  generateQuizPrompt
} from "@/app/api/workflow/generate-quiz/utils";
import { WorkflowNonRetryableError } from "@upstash/workflow";
import { indexQuiz } from "@/lib/vector";


export const { POST } = serve(
  async (context) => {
    const generationResult = await context.run("generate-quiz", async () => {
      try {
        const today = format(new Date(), "d MMM yyyy");
        const difficulty = randomDifficulty();
        const count = randomCount();
        const selected = await pickRandomSubCategory();
        const existingTitles = await fetchExistingQuizTitles(selected.category.id, selected.subCategory.id);

        const result = await generateText({
          model,
          output: Output.object({
            schema: QuizDoc
          }),
          system: `Strict JSON only. No markdown. No extra commentary.`,
          prompt: generateQuizPrompt({
            categoryName: selected.category.name,
            subCategoryName: selected.subCategory.name,
            difficulty,
            count,
            today,
            existingTitles
          })
        });

        return {
          categoryId: selected.category.id,
          subCategoryId: selected.subCategory.id,
          quizDoc: result.output
        };
      } catch (error) {
        console.error("Quiz generation error:", error);
        throw new WorkflowNonRetryableError(`Quiz generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    });

    const savedQuiz = await context.run("save-quiz", async () => {
      try {
        const { categoryId, subCategoryId, quizDoc } = generationResult;

        return prisma.quiz.create({
          data: {
            quizPageTitle: quizDoc.quizPageTitle,
            quizPageDescription: quizDoc.quizPageDescription,
            categoryId,
            subCategoryId,
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
        });
      } catch (error) {
        console.error("Quiz save error:", error);
        throw new WorkflowNonRetryableError(`Quiz save failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    });

    await context.run("index-quiz", async () => {
      const { quizDoc } = generationResult;

      await indexQuiz({
        quizId: savedQuiz.id,
        title: quizDoc.title,
        description: quizDoc.description,
        difficulty: quizDoc.difficulty,
        tags: quizDoc.tags
      });

      await prisma.quiz.update({
        where: { id: savedQuiz.id },
        data: { isIndexed: true },
      });
    });

    return { quizId: savedQuiz.id };
  },
  {
    failureFunction: () => {
      throw new WorkflowNonRetryableError("Workflow execution failed");
    }
  }
);
