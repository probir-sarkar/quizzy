import { Index } from "@upstash/vector";

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

  await index.upsert({
    id: quizId,
    data: `${title}. ${description}. Tags: ${tags.join(", ")}`,
    metadata: { title, description, difficulty, tags }
  });
}
