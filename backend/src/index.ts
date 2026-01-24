import { Hono } from "hono";
const app = new Hono();
import { getPrisma } from "../lib/prisma";

export { MyWorkflow } from "../workflows/test-workflow";

app.get("/", (c) => c.text("Hello Cloudflare Workers!"));

app.get("/health", (c) => c.text("OK"));

app.get("/categories", async (c) => {
  const prisma = getPrisma();
  const categories = await prisma.category.findMany();
  return c.json(categories);
});

export default app;
