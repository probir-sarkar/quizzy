import dynamic from "next/dynamic";

import QuizPageHero from "@/components/quiz-page/quiz-page.hero";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ShareButtons from "@/components/common/ShareButtons";
import TelegramCTA from "@/components/common/telegram-cta";
import QuizQuestions from "@/components/quiz-page/question-list";

import ToolboxPromoCard from "@/components/common/toolbox-promo-card";
import { MoreQuizzesSection } from "@/components/quiz-page/more-quizzes-section";
import { BASE_URL } from "@/lib/constants";
import { client } from "@/lib/orpc";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;

  const post = await client.getQuizMetadata({ slug });

  if (!post) return {};

  return {
    title: post.quizPageTitle + " | Quiz Zone",
    description: post.quizPageDescription,
    keywords: post.tags.map((tag) => tag.tag.name),
    category: post?.category?.name,
    alternates: {
      canonical: `${BASE_URL}/quiz/${slug}`
    },
    openGraph: {
      title: post.quizPageTitle,
      description: post.quizPageDescription,
      url: `${BASE_URL}/quiz/${slug}`,
      siteName: "Quizzy",
      type: "website"
    }
  };
}

async function QuizPage({ params }: Props) {
  const { slug } = await params;

  const quiz = await client.getQuiz({ slug });
  if (!quiz) return notFound();

  const categorySlug = quiz.category?.slug ?? "general";
  const categoryName = quiz.category?.name ?? "General";

  return (
    <>
      <section className="bg-gray-50 dark:bg-slate-950">
        <QuizPageHero
          quiz={quiz as any}
          breadcrumbs={[
            { label: "Categories", href: "/category" },
            { label: categoryName, href: `/category/${categorySlug}` },
            { label: quiz.title || "", href: "#", active: true }
          ]}
        />
        <QuizQuestions questions={quiz.questions} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <TelegramCTA className="max-w-xl " />
          <ShareButtons url={process.env.NEXT_PUBLIC_URL + "/quiz/" + slug} title={quiz.quizPageTitle || ""} />
        </div>

        {/* Toolbox Promotion */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
          <ToolboxPromoCard variant="default" />
        </div>

        {/* More Quizzes - Client Component with TanStack Query */}
        <MoreQuizzesSection slug={slug} />
      </section>
    </>
  );
}

export default QuizPage;
