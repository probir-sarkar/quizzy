import { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/constants";
import { allHistorySlugs } from "@/lib/history-utils";
import { client } from "@/lib/orpc";
const currentDate = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { homePageData, categories } = await client.getHomePageData();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${BASE_URL}/category`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: `${BASE_URL}/this-day-in-history`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8
    }
  ];

  // Collect all quizzes from home data
  const allQuizzes = homePageData.flatMap((category) => category.quizzes ?? []) ?? [];

  const quizUrls: MetadataRoute.Sitemap = allQuizzes.map((quiz) => ({
    url: `${BASE_URL}/quiz/${quiz.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories?.map((category) => ({
    url: `${BASE_URL}/category/${category.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.7
  })) ?? [];

  const historyDateUrls: MetadataRoute.Sitemap = allHistorySlugs().map((slug) => ({
    url: `${BASE_URL}/this-day-in-history/${slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.6
  }));

  return [...staticPages, ...quizUrls, ...categoryUrls, ...historyDateUrls];
}
