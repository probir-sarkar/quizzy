import { notFound } from "next/navigation";
import { getAdminQuizById, getCategoriesWithCounts, getAllSubCategories, getAllTags } from "@/queries/admin";
import { QuizForm } from "@/components/admin/quiz-form";
import { FileText } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminQuizEditPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === "new";

  // Fetch categories, subcategories, and tags
  const [categories, subCategories, tags, quiz] = await Promise.all([
    getCategoriesWithCounts(),
    getAllSubCategories(),
    getAllTags(),
    isNew ? null : getAdminQuizById(id),
  ]);

  if (!isNew && !quiz) {
    notFound();
  }

  // Transform data for form
  const initialData = quiz
    ? {
        ...quiz,
        categoryId: quiz.category?.id?.toString() || "",
        subCategoryId: quiz.subCategory?.id?.toString() || "",
        tagIds: quiz.tags.map((t) => {
          const tag = tags.find((tag) => tag.name === t.name);
          return tag?.id;
        }).filter(Boolean) as number[],
      }
    : undefined;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {isNew ? "Create New Quiz" : "Edit Quiz"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isNew
              ? "Fill in the details to create a new quiz"
              : "Update your quiz content"}
          </p>
        </div>
      </div>

      <QuizForm
        initialData={initialData}
        categories={categories}
        subCategories={subCategories}
        tags={tags}
        isEdit={!isNew}
      />
    </div>
  );
}
