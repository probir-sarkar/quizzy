import QuizQuestions from "@/components/quiz-page/question-list";
import QuizPageHero from "@/components/quiz-page/quiz-page.hero";
import { getMoreQuizzes, getQuiz } from "@/queries/home-page";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { QuizCard } from "@/components/home-page/quiz-listing";
import ShareButtons from "@/components/common/ShareButtons";
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
    title: post.quizPageTitle + " | Quiz Zone",
    description: post.quizPageDescription,
    keywords: post.tags.map((tag) => tag.tag.name),
    category: post?.category?.name
  };
}

async function QuizPage({ params }: Props) {
  const { slug } = await params;
  const quiz = await getQuiz(slug);
  if (!quiz) return notFound();

  const moreQuizzes = await getMoreQuizzes(slug);

  return (
    <section>
      <QuizPageHero quiz={quiz} />
      <QuizQuestions questions={quiz.questions} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ShareButtons url={process.env.NEXT_PUBLIC_URL + "/quiz/" + slug} title={quiz.quizPageTitle} />
      </div>
      {moreQuizzes?.length > 0 && (
        <div className="bg-purple-100 dark:bg-gray-900  p-8 shadow-sm mt-12 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Check These Out Too</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {moreQuizzes.map((q, i) => (
                <QuizCard key={q.id} delay={0.1} index={i} quiz={q} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default QuizPage;
