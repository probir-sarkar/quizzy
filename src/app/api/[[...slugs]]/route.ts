import { getCategories } from "@/queries/categories.query";
import { getHomePageData } from "@/queries/home-page";
import { getStats } from "@/queries/stats";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

app
  .get("/categories", async (c) => {
    const categories = await getCategories();
    return c.json(categories);
  })
  .get("/home", async (c) => {
    const [data, stats] = await Promise.all([getHomePageData(), getStats()]);

    return c.json({ data, stats });
  });

export const GET = handle(app);
export const POST = handle(app);
