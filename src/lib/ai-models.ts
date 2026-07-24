// import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const provider = createOpenAICompatible({
  name: "OpenRouter",
  baseURL: process.env.OPENAI_BASE_URL || "",
  apiKey: process.env.OPENAI_API_KEY || ""
});

export const model = provider(process.env.OPENAI_MODEL!);
