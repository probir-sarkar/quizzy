import QuizPageHero from "@/components/quiz-page/quiz-page.hero";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ShareButtons from "@/components/common/ShareButtons";
import TelegramCTA from "@/components/common/telegram-cta";
import QuizQuestions from "@/components/quiz-page/question-list";
import ToolboxPromoCard from "@/components/common/toolbox-promo-card";
import { MoreQuizzesSection } from "@/components/quiz-page/more-quizzes-section";
import { api } from "@/lib/eden";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;

  const { data: post } = await api.quiz.metadata.get({
    query: { slug }
  });

  if (!post) return {};

  const baseUrl = process.env.BASE_URL ?? "https://quizzy.probir.dev";

  return {
    title: post.quizPageTitle + " | Quiz Zone",
    description: post.quizPageDescription,
    keywords: post.tags.map((tag) => tag.tag.name),
    category: post?.category?.name,
    alternates: {
      canonical: `${baseUrl}/quiz/${slug}`
    },
    openGraph: {
      title: post.quizPageTitle,
      description: post.quizPageDescription,
      url: `${baseUrl}/quiz/${slug}`,
      siteName: "Quizzy",
      type: "website"
    }
  };
}

async function QuizPage({ params }: Props) {
  const { slug } = await params;

  const { data: quiz } = await api.quiz.detail.get({
    query: { slug }
  });

  if (!quiz) return notFound();
  if (!quiz.questions || quiz.questions.length === 0) return notFound();
  if (!quiz.tags) return notFound();

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
