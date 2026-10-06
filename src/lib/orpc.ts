import type { RouterClient } from '@orpc/server'
import { createRouterClient } from '@orpc/server'
import { RPCLink } from '@orpc/client/fetch'
import { createORPCClient } from '@orpc/client'
import { createIsomorphicFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { router } from '@/server/router'

/**
 * Isomorphic oRPC client (see orpc.dev/docs/adapters/tanstack-start):
 * - browser: RPCLink posting to the /rpc server route (Redis cache applies)
 * - server (SSR/loaders): direct in-process router client, no HTTP round trip
 *
 * The Start compiler strips the `.server()` branch (and its server-only
 * imports) from the client bundle.
 */
const getORPCClient = createIsomorphicFn()
  .server(() =>
    createRouterClient(router, {
      context: async () => ({
        headers: getRequestHeaders(), // forward request headers if procedures need them
      }),
    }),
  )
  .client((): RouterClient<typeof router> => {
    const link = new RPCLink({
      // RPCLink constructs `new URL(url)`, which throws for relative paths —
      // resolve against the page origin.
      url: `${window.location.origin}/rpc`,
    })
    return createORPCClient(link)
  })

export const client: RouterClient<typeof router> = getORPCClient()
