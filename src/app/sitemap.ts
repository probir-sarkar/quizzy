// app/sitemap/quizzes/[id]/sitemap.ts
import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { BASE_URL } from "@/lib/constants";
// export const dynamic = "force-dynamic";
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const quizzes = await prisma.quiz.findMany({
    orderBy: { id: "asc" },
    select: { slug: true, updatedAt: true }
  });

  return quizzes.map((q) => ({
    url: `${BASE_URL}/quiz/${q.slug}`,
    lastModified: q.updatedAt
  }));
}
