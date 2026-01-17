// app/sitemap/quizzes/[id]/sitemap.ts
import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { BASE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
    select: { slug: true }
  });

  return categories.map((q) => ({
    url: `${BASE_URL}/category/${q.slug}`,
  }));
}
