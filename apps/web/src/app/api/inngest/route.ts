import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { generateQuizFn } from "@/inngest/geretare-quiz";
export const dynamic = "force-dynamic"; // this API route is dynamic
// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [generateQuizFn]
});
