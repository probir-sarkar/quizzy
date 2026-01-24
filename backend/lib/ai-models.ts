import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { env } from "cloudflare:workers";

/**
 * Creates and returns an OpenAI-compatible AI model instance configured for Cloudflare Workers.
 *
 * This function uses environment variables for configuration:
 * - `OPENAI_BASE_URL`: The base URL for the OpenAI-compatible API
 * - `OPENAI_API_KEY`: The API key for authentication
 * - `OPENAI_MODEL`: The model identifier to use
 *
 * @returns A configured OpenAI-compatible language model instance
 * @throws Will throw an error if required environment variables are not set
 *
 * @example
 * ```ts
 * const model = getOpenAI();
 * const result = await generateText({ model, prompt: "Hello" });
 * ```
 */
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
