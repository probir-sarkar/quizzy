import { MetadataRoute } from "next";
import { client } from "@/lib/orpc";
import { ZodiacSign } from "@/generated/prisma/client";
import { BASE_URL } from "@/lib/constants";
const currentDate = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, homeData] = await Promise.all([
    client.getQuizCategories(),
    client.getQuizHomeData()
  ]);

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
      url: `${BASE_URL}/horoscope`,
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
  const allQuizzes = homeData?.flatMap((category) => category.quizzes ?? []) ?? [];

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

  const horoscopeUrls: MetadataRoute.Sitemap = Object.values(ZodiacSign).map((sign) => ({
    url: `${BASE_URL}/horoscope/${sign.toLowerCase()}`,
    lastModified: currentDate,
    changeFrequency: "daily" as const,
    priority: 0.7
  }));

  return [...staticPages, ...quizUrls, ...categoryUrls, ...horoscopeUrls];
}
