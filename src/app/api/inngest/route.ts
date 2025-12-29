import { serve } from "inngest/next";
import { helloWorld } from "@/inngest/functions";
import { inngest } from "@/inngest/client";
import { generateQuizFn } from "@/inngest/geretare-quiz";
import { socialMediaShare } from "@/inngest/social-media-share/social-media-share.inngest";
import { generateHoroscopeFn } from "@/inngest/horoscope";
import { shareHoroscope } from "@/inngest/share-horoscope";
import { generatePastEvent } from "@/inngest/past-events/generate-past-event";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [generateQuizFn]
});
