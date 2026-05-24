import CategoryHero from "@/components/category/CategoryHero";
import { QuizList } from "./quiz-list";
import { notFound } from "next/navigation";
import { client } from "@/lib/orpc";
import { BASE_URL } from "@/lib/constants";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const categoryInfo = await client.getQuizCategoryInfo({ slug });

  if (!categoryInfo) {
    notFound();
  }

  const categoryName = categoryInfo?.name;

  return {
    title: `${categoryName} Quizzes - Quizzy`,
    description: `Explore ${categoryName.toLowerCase()} quizzes on Quizzy. Test your knowledge with our collection of expertly crafted questions.`,
    alternates: {
      canonical: `${BASE_URL}/category/${slug}`
    },
    openGraph: {
      title: `${categoryName} Quizzes - Quizzy`,
      description: `Explore ${categoryName.toLowerCase()} quizzes on Quizzy. Test your knowledge with our collection of expertly crafted questions.`,
      url: `${BASE_URL}/category/${slug}`,
      siteName: "Quizzy",
      type: "website"
    }
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const categoryInfo = await client.getQuizCategoryInfo({ slug });

  if (!categoryInfo) {
    return notFound();
  }

  const categoryName = categoryInfo?.name || "";
  const categorySlug = categoryInfo?.slug || "";
  const categoryQuizCount = categoryInfo?._count?.quizzes || 0;
  const subCategoryCount = categoryInfo?.subCategories?.length || 0;

  return (
    <>
      <main>
        <CategoryHero
          category={{
            name: categoryName,
            slug: categorySlug,
            quizCount: categoryQuizCount,
            subCategryCount: subCategoryCount
          }}
        />
        <QuizList categorySlug={slug} />
      </main>
    </>
  );
}
