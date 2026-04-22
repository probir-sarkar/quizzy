import QuizPageHero from "@/components/quiz-page/quiz-page.hero";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { QuizCard } from "@/components/home-page/quiz-listing";
import ShareButtons from "@/components/common/ShareButtons";
import TelegramCTA from "@/components/common/telegram-cta";
import { Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import ToolboxPromoCard from "@/components/common/toolbox-promo-card";
import { api } from "@/lib/eden";

// Lazy load quiz components for better performance
const QuizQuestions = dynamic(() => import("@/components/quiz-page/question-list"), {
  loading: () => (
    <div className="max-w-3xl mx-auto px-4 space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-6 h-48 animate-pulse" />
      ))}
    </div>
  )
});

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = (await params).slug;

  const { data: post } = await api.quiz.metadata.get({
    query: { slug }
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

  const [{ data: quiz }, { data: moreQuizzes }] = await Promise.all([
    api.quiz.detail.get({
      query: { slug },
      fetch: {
        cache: "force-cache",
        next: {
          revalidate: 60 * 60
        }
      }
    }),
    api.quiz.more.get({
      query: { slug },
      fetch: {
        cache: "force-cache",
        next: {
          revalidate: 60 * 60
        }
      }
    })
  ]);

  if (!quiz) return notFound();

  return (
    <section>
      <QuizPageHero
        quiz={quiz}
        breadcrumbs={[
          { label: "Categories", href: "/category" },
          { label: quiz.category?.name || "General", href: `/category/${quiz.category?.slug}` },
          { label: quiz.title, href: "#", active: true }
        ]}
      />
      <QuizQuestions questions={quiz.questions} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <TelegramCTA className="max-w-xl " />
        <ShareButtons url={process.env.NEXT_PUBLIC_URL + "/quiz/" + slug} title={quiz.quizPageTitle} />
      </div>

      {/* Toolbox Promotion */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <ToolboxPromoCard variant="default" />
      </div>
      {moreQuizzes && moreQuizzes.length > 0 && (
        <div className="mt-12 md:mt-24 border-t border-white/5 bg-slate-900/30 py-10 md:py-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-6 md:mb-10">
              <div className="p-2 rounded-xl bg-violet-600/10 border border-violet-600/20">
                <Sparkles className="w-5 h-5 text-violet-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Expand Your Mind</h2>
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
