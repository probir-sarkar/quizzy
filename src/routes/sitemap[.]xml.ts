import { createFileRoute } from "@tanstack/react-router";
import { BASE_URL } from "@/lib/constants";
import { allHistorySlugs } from "@/lib/history-utils";
import { client } from "@/lib/orpc";

function urlEntry(url: string, changeFrequency: string, priority: number, lastModified: Date) {
  return [
    "  <url>",
    `    <loc>${url}</loc>`,
    `    <lastmod>${lastModified.toISOString()}</lastmod>`,
    `    <changefreq>${changeFrequency}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const currentDate = new Date();
        const { homePageData, categories } = await client.getHomePageData();

        const staticPages = [
          urlEntry(BASE_URL, "daily", 1, currentDate),
          urlEntry(`${BASE_URL}/category`, "daily", 0.9, currentDate),
          urlEntry(`${BASE_URL}/this-day-in-history`, "daily", 0.8, currentDate),
        ];

        // Collect all quizzes from home data
        const allQuizzes = homePageData.flatMap((category) => category.quizzes ?? []) ?? [];

        const quizUrls = allQuizzes.map((quiz) =>
          urlEntry(`${BASE_URL}/quiz/${quiz.slug}`, "weekly", 0.8, new Date()),
        );

        const categoryUrls =
          categories?.map((category) => urlEntry(`${BASE_URL}/category/${category.slug}`, "weekly", 0.7, currentDate)) ??
          [];

        const historyDateUrls = allHistorySlugs().map((slug) =>
          urlEntry(`${BASE_URL}/this-day-in-history/${slug}`, "monthly", 0.6, currentDate),
        );

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...staticPages,
          ...quizUrls,
          ...categoryUrls,
          ...historyDateUrls,
          "</urlset>",
        ].join("\n");

        return new Response(xml, { headers: { "content-type": "application/xml" } });
      },
    },
  },
});
