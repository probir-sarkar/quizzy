import QuizPageHero from "@/components/quiz-page/quiz-page.hero";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizCard } from "@/components/home-page/quiz-card";
import ShareButtons from "@/components/common/ShareButtons";
import TelegramCTA from "@/components/common/telegram-cta";
import { Sparkles } from "lucide-react";
import QuizQuestions from "@/components/quiz-page/question-list";
import ToolboxPromoCard from "@/components/common/toolbox-promo-card";
import { api } from "@/lib/eden";

type Props = {
  params: Promise<{ slug: string }>
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

  const [{ data: quiz }, { data: moreQuizzes }] = await Promise.all([
    api.quiz.detail.get({
      query: { slug },
    }),
    api.quiz.more.get({
      query: { slug },

    })
  ]);

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
        {moreQuizzes && moreQuizzes.length > 0 && (
          <div className="mt-12 md:mt-24 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-slate-900 py-10 md:py-20 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-6 md:mb-10">
                <div className="p-2 rounded-xl bg-violet-600/10 border border-violet-600/20">
                  <Sparkles className="w-5 h-5 text-violet-500" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Expand Your Mind</h2>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {moreQuizzes.map((q, i) => (
                  <QuizCard key={q.id} index={i} quiz={q} />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default QuizPage;
