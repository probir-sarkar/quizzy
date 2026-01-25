import { Hono } from "hono";
import { getPrisma } from "../lib/prisma";

const app = new Hono<{ Bindings: CloudflareBindings }>();

// Export the quiz generation workflow for Cloudflare Workers
export { GenerateQuizWorkflow } from "../workflows/generate-quiz";

// Root endpoint
app.get("/", (c) => c.text("Quizzy Cloudflare Workers Backend"));

// Health check endpoint
app.get("/health", (c) => c.text("OK"));

// Categories API endpoint
app.get("/categories", async (c) => {
  const prisma = getPrisma();
  const categories = await prisma.category.findMany();
  return c.json(categories);
});

export default {
  fetch: app.fetch,
  async scheduled(controller: ScheduledController, env: Cloudflare.Env, ctx: ExecutionContext) {
    // trigger workflow every 10 minutes
    await env.GENERATE_QUIZ.create()
  }
};
