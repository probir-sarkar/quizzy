import CategoryHero from "@/components/category/CategoryHero";
import SubCategoryFilters from "@/components/category/sub-category-filter";
import { QuizCard } from "@/components/home-page/quiz-listing";
import { getQuizzesByCategory } from "@/queries/categories.query";
import { notFound } from "next/navigation";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page = 1, subcategory = null } = await searchParams;

  // server-side fetch the first page of quizzes
  const quizzes = await getQuizzesByCategory({
    categorySlug: slug,
    page: Number(page),
    subCategorySlug: subcategory
  });
  if (!quizzes) return notFound();
  const quizzesList = quizzes.items;
  const subcategoris = quizzes.category?.subCategories || [];
  return (
    <main>
      <CategoryHero
        category={{
          name: quizzes.category?.name || "",
          slug: quizzes.category?.slug || "",
          quizCount: quizzes.category?._count.quizzes || 0,
          subCategryCount: quizzes.category?.subCategories?.length || 0
        }}
      />
      <div className="">
        <SubCategoryFilters
          subCategories={subcategoris.map((sc) => ({
            name: sc.name,
            slug: sc.slug,
            count: sc._count.quizzes
          }))}
        />
      </div>
      <div id="quizzes" className="container mx-auto px-6 py-10">
        {quizzesList?.length > 0 && (
          <div className="px-4 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 container mx-auto">
            {quizzesList.map((q, i) => (
              <QuizCard key={q.id} delay={0.1} index={i} quiz={q} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
