import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
export const zai = createOpenAICompatible({
  name: "zai",
  apiKey: process.env.ZAI_API_KEY,
  baseURL: "https://api.z.ai/api/paas/v4/"
});
