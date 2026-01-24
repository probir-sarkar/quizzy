"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import {
  getAdminQuizzes,
  getAdminQuizById,
  getDashboardAnalytics,
  getCategoriesWithCounts,
  getAllSubCategories,
  getAllTags,
} from "@/queries/admin";
import type { QuizDifficulty } from "@/generated/prisma/client";

// ==================== Auth ====================

export async function adminLogin(password: string) {
  "use server";

  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (password === adminPassword) {
    const cookieStore = await cookies();
    const sessionValue = Buffer.from(adminPassword).toString("base64");
    cookieStore.set("admin_session", sessionValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return { success: true };
  }

  return { success: false, error: "Invalid password" };
}

export async function adminLogout() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return { success: true };
}

// ==================== Analytics ====================

export async function getAnalytics() {
  "use server";

  try {
    return await getDashboardAnalytics();
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return null;
  }
}

// ==================== Quizzes ====================

export async function getQuizzes(filters: {
  search?: string;
  category?: string;
  difficulty?: QuizDifficulty;
  isPublished?: boolean;
  page?: number;
  limit?: number;
}) {
  "use server";

  try {
    return await getAdminQuizzes(filters);
  } catch (error) {
    console.error("Failed to fetch quizzes:", error);
    return { quizzes: [], total: 0, pages: 0, currentPage: 1 };
  }
}

export async function getQuizById(id: string) {
  "use server";

  try {
    return await getAdminQuizById(id);
  } catch (error) {
    console.error("Failed to fetch quiz:", error);
    return null;
  }
}

export async function createQuiz(data: {
  title: string;
  description: string;
  slug: string;
  quizPageTitle: string;
  quizPageDescription: string;
  difficulty: QuizDifficulty;
  categoryId?: string;
  subCategoryId?: string;
  tagIds?: number[];
  questions?: Array<{
    text: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
  }>;
  isPublished?: boolean;
}) {
  "use server";

  try {
    const quiz = await prisma.quiz.create({
      data: {
        title: data.title,
        description: data.description,
        slug: data.slug,
        quizPageTitle: data.quizPageTitle,
        quizPageDescription: data.quizPageDescription,
        difficulty: data.difficulty,
        categoryId: data.categoryId ? parseInt(data.categoryId) : null,
        subCategoryId: data.subCategoryId ? parseInt(data.subCategoryId) : null,
        isPublished: data.isPublished || false,
        publishedAt: data.isPublished ? new Date() : null,
        questions: {
          create: data.questions?.map((q) => ({
            text: q.text,
            options: q.options,
            correctIndex: parseInt(q.correctIndex.toString()),
            explanation: q.explanation || null,
          })) || [],
        },
        tags: {
          create: data.tagIds?.map((tagId) => ({
            tagId,
          })) || [],
        },
      },
      include: {
        category: true,
        subCategory: true,
        tags: { include: { tag: true } },
        questions: true,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/quizzes");
    return { success: true, quiz };
  } catch (error) {
    console.error("Create quiz error:", error);
    return { success: false, error: "Failed to create quiz" };
  }
}

export async function updateQuiz(
  id: string,
  data: {
    title: string;
    description: string;
    slug: string;
    quizPageTitle: string;
    quizPageDescription: string;
    difficulty: QuizDifficulty;
    categoryId?: string;
    subCategoryId?: string;
    tagIds?: number[];
    questions?: Array<{
      id?: string;
      text: string;
      options: string[];
      correctIndex: number;
      explanation?: string;
    }>;
    isPublished?: boolean;
    wasPublished?: boolean;
    publishedAt?: Date | null;
  }
) {
  "use server";

  try {
    // First, delete existing tags and questions
    await prisma.quizTag.deleteMany({
      where: { quizId: id },
    });

    await prisma.question.deleteMany({
      where: { quizId: id },
    });

    // Update quiz
    const quiz = await prisma.quiz.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        slug: data.slug,
        quizPageTitle: data.quizPageTitle,
        quizPageDescription: data.quizPageDescription,
        difficulty: data.difficulty,
        categoryId: data.categoryId ? parseInt(data.categoryId) : null,
        subCategoryId: data.subCategoryId ? parseInt(data.subCategoryId) : null,
        isPublished: data.isPublished || false,
        publishedAt:
          data.isPublished && !data.wasPublished
            ? new Date()
            : data.publishedAt,
        questions: {
          create: data.questions?.map((q) => ({
            text: q.text,
            options: q.options,
            correctIndex: parseInt(q.correctIndex.toString()),
            explanation: q.explanation || null,
          })) || [],
        },
        tags: {
          create: data.tagIds?.map((tagId) => ({
            tagId,
          })) || [],
        },
      },
      include: {
        category: true,
        subCategory: true,
        tags: { include: { tag: true } },
        questions: true,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/quizzes");
    revalidatePath(`/admin/quizzes/${id}`);
    return { success: true, quiz };
  } catch (error) {
    console.error("Update quiz error:", error);
    return { success: false, error: "Failed to update quiz" };
  }
}

export async function deleteQuiz(id: string) {
  "use server";

  try {
    await prisma.quiz.delete({
      where: { id },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/quizzes");
    return { success: true };
  } catch (error) {
    console.error("Delete quiz error:", error);
    return { success: false, error: "Failed to delete quiz" };
  }
}

export async function toggleQuizPublish(id: string, isPublished: boolean) {
  "use server";

  try {
    const quiz = await prisma.quiz.update({
      where: { id },
      data: {
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/quizzes");
    return { success: true, quiz };
  } catch (error) {
    console.error("Toggle publish error:", error);
    return { success: false, error: "Failed to update publish status" };
  }
}

// ==================== Categories ====================

export async function getCategories() {
  "use server";

  try {
    return await getCategoriesWithCounts();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function getSubCategories() {
  "use server";

  try {
    return await getAllSubCategories();
  } catch (error) {
    console.error("Failed to fetch subcategories:", error);
    return [];
  }
}

export async function createCategory(data: { name: string; slug: string }) {
  "use server";

  try {
    const category = await prisma.category.create({
      data: { name: data.name, slug: data.slug },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/categories");
    return { success: true, category };
  } catch (error) {
    console.error("Create category error:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(id: number, data: { name: string; slug: string }) {
  "use server";

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name: data.name, slug: data.slug },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/categories");
    return { success: true, category };
  } catch (error) {
    console.error("Update category error:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: number) {
  "use server";

  try {
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Delete category error:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

// ==================== Tags ====================

export async function getTags() {
  "use server";

  try {
    return await getAllTags();
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return [];
  }
}

export async function createTag(data: { name: string }) {
  "use server";

  try {
    const tag = await prisma.tag.create({
      data: { name: data.name },
    });

    revalidatePath("/admin");
    return { success: true, tag };
  } catch (error) {
    console.error("Create tag error:", error);
    return { success: false, error: "Failed to create tag" };
  }
}
