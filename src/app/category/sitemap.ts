// app/sitemap/quizzes/[slug]/sitemap.ts
import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { BASE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic"; // optional: keep if you need fresh data

// Must return an array of objects matching the dynamic param shape: { slug: string }
export async function generateSitemaps() {
  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
    select: { id: true }
  });

  // map to the route param name used in the folder: { slug }
  return categories.map((c) => ({ id: c.id }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  // find quizzes for this category (select slug and updatedAt)
  const quizzes = await prisma.quiz.findMany({
    where: { category: { id: +id } },
    orderBy: { id: "asc" },
    select: { slug: true, updatedAt: true }
  });

  // map to the sitemap entries
  return quizzes.map((q) => ({
    url: `${BASE_URL}/quiz/${q.slug}`,
    lastModified: q.updatedAt // Date is OK; you can also do q.updatedAt.toISOString()
  }));
}
