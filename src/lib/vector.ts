import { Index } from "@upstash/vector";

export type QuizVectorMetadata = { title: string; description: string; difficulty: string; tags: string[] };

export async function indexQuiz({
  quizId,
  title,
  description,
  difficulty,
  tags
}: {
  quizId: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
}) {
  const index = Index.fromEnv();

  await index.upsert<QuizVectorMetadata>({
    id: quizId,
    data: `${title}. ${description}. Tags: ${tags.join(", ")}`,
    metadata: { title, description, difficulty, tags }
  });
}
