import QuizQuestions from "@/components/quiz-page/question-list";
import QuizPageHero from "@/components/quiz-page/quiz-page.hero";
import { getMoreQuizzes, getQuiz } from "@/queries/home-page";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { QuizCard } from "@/components/home-page/quiz-listing";
import ShareButtons from "@/components/common/ShareButtons";
import TelegramCTA from "@/components/common/telegram-cta";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { Sparkles } from "lucide-react";
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
      <div className="max-w-7xl mx-auto px-6 pt-32">
        <Breadcrumbs
          items={[
            { label: "Categories", href: "/category" },
            { label: quiz.category?.name || "General", href: `/category/${quiz.category?.slug}` },
            { label: quiz.title, href: "#", active: true }
          ]}
        />
      </div>
      <QuizPageHero quiz={quiz} />
      <QuizQuestions questions={quiz.questions} />

      <div className="max-w-7xl mx-auto pl-7 pr-6">
        <TelegramCTA className="max-w-xl " />
        <ShareButtons url={process.env.NEXT_PUBLIC_URL + "/quiz/" + slug} title={quiz.quizPageTitle} />
      </div>
      {moreQuizzes?.length > 0 && (
        <div className="mt-24 border-t border-white/5 bg-slate-900/30 py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2 rounded-xl bg-violet-600/10 border border-violet-600/20">
                <Sparkles className="w-5 h-5 text-violet-500" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">Expand Your Mind</h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {moreQuizzes.map((q, i) => (
                <QuizCard key={q.id} delay={0.1 * i} index={i} quiz={q} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default QuizPage;
