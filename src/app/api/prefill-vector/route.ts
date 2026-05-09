import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import prisma from "@/lib/prisma";
import { indexQuiz } from "@/lib/vector";

export const POST = verifySignatureAppRouter(async (req: Request) => {
  const body = await req.json();
  const { quizId } = body as { quizId: string };

  const savedQuiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { tags: { select: { tag: { select: { name: true } } } } }
  });

  if (!savedQuiz) {
    throw new Error("quiz not found");
  }

  const tagNames = savedQuiz.tags.map((t) => t.tag.name);

  await indexQuiz({
    quizId: savedQuiz.id,
    title: savedQuiz.title,
    description: savedQuiz.description,
    difficulty: savedQuiz.difficulty,
    tags: tagNames
  });

  await prisma.quiz.update({
    where: { id: quizId },
    data: { isIndexed: true }
  });

  return new Response(JSON.stringify({ success: true, quizId: savedQuiz.id }), {
    headers: { "Content-Type": "application/json" }
  });
});
