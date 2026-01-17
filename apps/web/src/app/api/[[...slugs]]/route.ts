import { Elysia } from "elysia";
import { getCategories } from "@/queries/categories.query";
import { getHomePageData } from "@/queries/home-page";
import { getStats } from "@/queries/stats";

export const app = new Elysia({ prefix: "/api" })
  .get("/categories", async () => {
    return await getCategories();
  })
  .get("/health", () => "OK")
  .get("/home", async () => {
    const [data, stats] = await Promise.all([getHomePageData(), getStats()]);
    return { data, stats };
  });

export const GET = app.fetch;
export const POST = app.fetch;
