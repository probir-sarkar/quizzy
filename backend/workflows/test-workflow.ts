import { WorkflowEntrypoint, WorkflowStep } from "cloudflare:workers";
import type { WorkflowEvent } from "cloudflare:workers";
import { Env } from "hono";

type Params = { name: string };
type IPResponse = { result: { ipv4_cidrs: string[] } };

export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    const data = await step.do("fetch data", async () => {
      const response = await fetch("https://api.cloudflare.com/client/v4/ips");
      return await response.json<IPResponse>();
    });

    await step.sleep("pause", "20 seconds");

    const result = await step.do(
      "process data",
      { retries: { limit: 3, delay: "5 seconds", backoff: "linear" } },
      async () => {
        return {
          name: event.payload.name,
          ipCount: data.result.ipv4_cidrs.length
        };
      }
    );

    return result;
  }
}
