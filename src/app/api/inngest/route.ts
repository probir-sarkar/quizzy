import { serve } from "inngest/next";
import { helloWorld } from "@/inngest/functions";
import { inngest } from "@/inngest/client";
import { generateQuizFn } from "@/inngest/geretare-quiz";
import { socialMediaShare } from "@/inngest/social-media-share/social-media-share.inngest";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld, generateQuizFn, socialMediaShare],
});
