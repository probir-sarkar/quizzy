import { createFileRoute, notFound } from "@tanstack/react-router";

import QuizPageHero from "@/components/quiz-page/quiz-page.hero";
import QuizQuestions from "@/components/quiz-page/question-list";
import BrowserStayPromoCard from "@/components/common/browserstay-promo-card";
import { MoreQuizzesSection } from "@/components/quiz-page/more-quizzes-section";
import { QuizSkeleton } from "@/components/route-fallbacks/quiz-skeleton";
import { BASE_URL } from "@/lib/constants";
import { client } from "@/lib/orpc";

export const Route = createFileRoute("/quiz/$slug")({
  loader: async ({ params }) => {
    const slug = params.slug;

    const [metadata, quiz] = await Promise.all([client.getQuizMetadata({ slug }), client.getQuizDetail({ slug })]);

    if (!quiz) throw notFound();

    return { slug, metadata, quiz };
  },
  pendingComponent: QuizSkeleton,
  head: ({ loaderData }) => {
    const post = loaderData?.metadata;
    if (!post || !loaderData) return {};

    return {
      meta: [
        { title: post.quizPageTitle + " | Quiz Zone" },
        { name: "description", content: post.quizPageDescription },
        { name: "keywords", content: post.tags.map((tag) => tag.tag.name).join(", ") },
        ...(post?.category?.name ? [{ name: "category", content: post.category.name }] : []),
        { property: "og:title", content: post.quizPageTitle },
        { property: "og:description", content: post.quizPageDescription },
        { property: "og:url", content: `${BASE_URL}/quiz/${loaderData.slug}` },
        { property: "og:site_name", content: "Quizzy" },
        { property: "og:type", content: "website" },
        { property: "og:image", content: `${BASE_URL}/quiz/${loaderData.slug}/og.png` },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: `${BASE_URL}/quiz/${loaderData.slug}/og.png` }
      ],
      links: [{ rel: "canonical", href: `${BASE_URL}/quiz/${loaderData.slug}` }]
    };
  },
  component: QuizPage
});

function QuizPage() {
  const { slug, quiz } = Route.useLoaderData();

  const categorySlug = quiz.category?.slug ?? "general";
  const categoryName = quiz.category?.name ?? "General";

  return (
    <section>
      <QuizPageHero
        quiz={quiz}
        breadcrumbs={[
          { label: "Categories", href: "/category" },
          { label: categoryName, href: `/category/${categorySlug}` },
          { label: quiz.title || "", href: "#", active: true }
        ]}
      />
      <QuizQuestions questions={quiz.questions} />

      {/* BrowserStay Promotion */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <BrowserStayPromoCard variant="default" />
      </div>

      {/* More Quizzes - Client Component with TanStack Query */}
      <MoreQuizzesSection slug={slug} />
    </section>
  );
}
