"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuizFormSchema, QuizFormData } from "@/lib/schemas/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Save, Eye } from "lucide-react";
import { QuestionsEditor } from "./questions-editor";
import { createQuiz, updateQuiz } from "@/app/admin/actions";

interface QuizFormProps {
  initialData?: any;
  categories?: Array<{ id: number; name: string; slug: string }>;
  subCategories?: Array<{
    id: number;
    name: string;
    slug: string;
    categoryId: number;
  }>;
  tags?: Array<{ id: number; name: string }>;
  isEdit?: boolean;
}

export function QuizForm({
  initialData,
  categories = [],
  subCategories = [],
  tags = [],
  isEdit = false,
}: QuizFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    initialData?.categoryId?.toString() || ""
  );

  const form = useForm<QuizFormData>({
    resolver: zodResolver(QuizFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      slug: "",
      quizPageTitle: "",
      quizPageDescription: "",
      difficulty: "medium",
      categoryId: "",
      subCategoryId: "",
      tagIds: [],
      questions: [],
      isPublished: false,
    },
  });

  const watchedTitle = form.watch("title");

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEdit && watchedTitle) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      form.setValue("slug", slug);
    }
  }, [watchedTitle, form, isEdit]);

  // Auto-generate quiz page title
  useEffect(() => {
    if (!isEdit && watchedTitle) {
      form.setValue("quizPageTitle", `${watchedTitle} | Quiz`);
    }
  }, [watchedTitle, form, isEdit]);

  const onSubmit = (data: QuizFormData, publish: boolean = false) => {
    startTransition(async () => {
      const payload = {
        ...data,
        isPublished: publish,
        tagIds: data.tagIds || [],
        wasPublished: initialData?.isPublished || false,
        publishedAt: initialData?.publishedAt,
      };

      const result = isEdit
        ? await updateQuiz(initialData.id, payload)
        : await createQuiz(payload);

      if (result.success) {
        toast.success(
          `Quiz ${publish ? "published" : isEdit ? "updated" : "created"} successfully`
        );
        router.push("/admin/quizzes");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save quiz");
      }
    });
  };

  const filteredSubCategories = selectedCategoryId
    ? subCategories.filter((sc) => sc.categoryId === parseInt(selectedCategoryId))
    : [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data, false))} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Basic Information</h3>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter quiz title..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe what this quiz is about..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug *</FormLabel>
                  <FormControl>
                    <Input placeholder="quiz-url-slug" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL-friendly version of the title
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* SEO Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">SEO Information</h3>

          <FormField
            control={form.control}
            name="quizPageTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Quiz Page Title" {...field} />
                </FormControl>
                <FormDescription>
                  Title shown on search engines and social media
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quizPageDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Meta description for SEO..."
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Category */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Category</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedCategoryId(value);
                      form.setValue("subCategoryId", "");
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategory</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!selectedCategoryId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredSubCategories.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id.toString()}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Questions */}
        <QuestionsEditor control={form.control} isLoading={isPending} />

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={form.handleSubmit((data) => onSubmit(data, false))}
            disabled={isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button
            type="button"
            onClick={form.handleSubmit((data) => onSubmit(data, true))}
            disabled={isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            <Eye className="h-4 w-4 mr-2" />
            {initialData?.isPublished ? "Update & Publish" : "Publish"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
