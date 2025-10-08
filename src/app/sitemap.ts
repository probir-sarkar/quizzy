// app/sitemap/quizzes/[id]/sitemap.ts
import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { BASE_URL } from "@/lib/constants";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
    select: { id: true }
  });

  return categories.map((q) => ({
    url: `${BASE_URL}/category/sitemap/${q.id}.xml`
  }));
}
