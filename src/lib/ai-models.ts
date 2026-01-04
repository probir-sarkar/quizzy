import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
export const zai = createOpenAICompatible({
  name: "zai",
  apiKey: process.env.ZAI_API_KEY,
  baseURL: "https://api.z.ai/api/paas/v4/"
});

const openai = createOpenAICompatible({
  baseURL: process.env.OPENAI_BASE_URL || "",
  apiKey: process.env.OPENAI_API_KEY || "",
  name: "openai",
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
  },
  supportsStructuredOutputs: true
});

export const model = openai(process.env.OPENAI_MODEL || "");
