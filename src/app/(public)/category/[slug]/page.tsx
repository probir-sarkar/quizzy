import CategoryHero from "@/components/category/CategoryHero";
import SubCategoryFilters from "@/components/category/sub-category-filter";
import { QuizCard } from "@/components/home-page/quiz-listing";
import { notFound } from "next/navigation";
import { api } from "@/lib/eden";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page = 1, subcategory } = await searchParams;

  const { data: quizzes } = await api.quiz["by-category"].get({
    query: {
      categorySlug: slug,
      page: Number(page),
      perPage: 12,
      subCategorySlug: subcategory ?? undefined
    },
    fetch: {
      cache: "force-cache",
      next: {
        revalidate: 60 * 60
      }
    }
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
            count: sc._count?.quizzes ?? 0
          }))}
        />
      </div>
      <div id="quizzes" className="container mx-auto px-6 py-10">
        {quizzesList && quizzesList.length > 0 && (
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
