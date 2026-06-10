import type { RouterClient } from "@orpc/server";
import { RPCLink } from "@orpc/client/fetch";
import { createORPCClient } from "@orpc/client";
import { router } from "@/server/router";

declare global {
  var $client: RouterClient<typeof router> | undefined;
}

const link = new RPCLink({
  url: "https://quizzy.probir.dev/rpc"
});

/**
 * Fallback to client-side client if server-side client is not available.
 */
// export const client: RouterClient<typeof router> = globalThis.$client ?? createORPCClient(link)
export const client: RouterClient<typeof router> = createORPCClient(link);
