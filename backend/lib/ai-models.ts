import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { env } from "cloudflare:workers";

export const getOpenAI = () => {
  const openai = createOpenAICompatible({
    baseURL: env.OPENAI_BASE_URL,
    apiKey: env.OPENAI_API_KEY,
    name: "openai",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`
    },
    supportsStructuredOutputs: true
  });

  return openai(env.OPENAI_MODEL);
};
