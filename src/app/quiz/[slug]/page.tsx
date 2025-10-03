import QuizQuestions from "@/components/quiz-page/question-list";
import QuizPageHero from "@/components/quiz-page/quiz-page.hero";
import { getQuiz } from "@/queries/home-page";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = (await params).slug;

  const post = await prisma.quiz.findUnique({
    where: { slug },
    select: {
      quizPageTitle: true,
      quizPageDescription: true,
      category: {
        select: {
          name: true
        }
      },
      tags: {
        select: {
          tag: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });

  if (!post) return {};

  return {
    title: post.quizPageTitle  + " | Quiz Zone",
    description: post.quizPageDescription,
    keywords: post.tags.map((tag) => tag.tag.name),
    category: post?.category?.name
  };
}

async function QuizPage({ params }: Props) {
  const { slug } = await params;
  const quiz = await getQuiz(slug);
  if (!quiz) return notFound();

  return (
    <section>
      <QuizPageHero quiz={quiz} />

      {/* Section title */}

      <QuizQuestions questions={quiz.questions} />
    </section>
  );
}

export default QuizPage;
