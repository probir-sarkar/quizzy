import { Hono } from "hono";
const app = new Hono<{ Bindings: CloudflareBindings }>();
import { getPrisma } from "../lib/prisma";
import { Bindings } from "hono/types";

export { MyWorkflow } from "../workflows/test-workflow";
export { GenerateQuizWorkflow } from "../workflows/generate-quiz";

app.get("/", (c) => c.text("Hello Cloudflare Workers!"));

app.get("/health", (c) => c.text("OK"));

app.get("/categories", async (c) => {
  const prisma = getPrisma();
  const categories = await prisma.category.findMany();
  return c.json(categories);
});

app.get("/trigger", async (c) => {
  return c.json(await c.env.GENERATE_QUIZ.create());
});

export default app;
