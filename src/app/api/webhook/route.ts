// app/api/webhook/route.ts
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

export const POST = verifySignatureAppRouter(
  async (request) => {
    // signed by the local dev server
    return new Response("ok");
  },
  { devMode: true }
);