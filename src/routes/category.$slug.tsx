import { createFileRoute, notFound } from "@tanstack/react-router";
import CategoryHero from "@/components/category/CategoryHero";
import { QuizList } from "@/components/category/quiz-list";
import { CategoryDetailSkeleton } from "@/components/route-fallbacks/category-detail-skeleton";
import { BASE_URL } from "@/lib/constants";
import { client } from "@/lib/orpc";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ params }) => {
    const categoryInfo = await client.getQuizCategoryInfo({ slug: params.slug });

    if (!categoryInfo) {
      throw notFound();
    }

    return categoryInfo;
  },
  pendingComponent: CategoryDetailSkeleton,
  head: ({ loaderData, params }) => {
    const categoryName = loaderData?.name;
    const description = categoryName
      ? `Explore ${categoryName.toLowerCase()} quizzes on Quizzy. Test your knowledge with our collection of expertly crafted questions.`
      : undefined;

    return {
      meta: [
        ...(categoryName ? [{ title: `${categoryName} Quizzes - Quizzy` }] : []),
        ...(description ? [{ name: "description", content: description }] : []),
        ...(categoryName ? [{ property: "og:title", content: `${categoryName} Quizzes - Quizzy` }] : []),
        ...(description ? [{ property: "og:description", content: description }] : []),
        { property: "og:url", content: `${BASE_URL}/category/${params.slug}` },
        { property: "og:site_name", content: "Quizzy" },
        { property: "og:type", content: "website" }
      ],
      links: [{ rel: "canonical", href: `${BASE_URL}/category/${params.slug}` }]
    };
  },
  component: CategoryPage
});

function CategoryPage() {
  const categoryInfo = Route.useLoaderData();

  const categoryName = categoryInfo?.name || "";
  const categorySlug = categoryInfo?.slug || "";
  const categoryQuizCount = categoryInfo?._count?.quizzes || 0;
  const subCategoryCount = categoryInfo?.subCategories?.length || 0;

  return (
    <main>
      <CategoryHero
        category={{
          name: categoryName,
          slug: categorySlug,
          quizCount: categoryQuizCount,
          subCategryCount: subCategoryCount
        }}
      />
      <QuizList categorySlug={categorySlug} />
    </main>
  );
}
