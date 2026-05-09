import { Client } from "@upstash/qstash";
import prisma from "@/lib/prisma";

const client = new Client({ token: process.env.QSTASH_TOKEN! });

export async function POST(req: Request) {
  const queue = client.queue({ queueName: "quiz-vector-index" });

  const unindexedQuizzes = await prisma.quiz.findMany({
    where: { isIndexed: false },
    select: { id: true },
  });
  const processUrl = `https://quizzy.probir.dev/api/prefill-vector`;

  for (const quiz of unindexedQuizzes) {
    await queue.enqueueJSON({
      url: processUrl,
      body: { quizId: quiz.id }
    });
  }

  return Response.json({
    ok: true,
    enqueued: unindexedQuizzes.length,
    remaining: await prisma.quiz.count({ where: { isIndexed: false } })
  });
}
