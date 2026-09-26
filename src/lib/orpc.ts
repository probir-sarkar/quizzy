import type { RouterClient } from '@orpc/server'
import { RPCLink } from '@orpc/client/fetch'
import { createORPCClient } from '@orpc/client'
import { router } from '@/server/router';
import { BASE_URL } from '@/lib/constants';

declare global {
  var $client: RouterClient<typeof router> | undefined
}

const link = new RPCLink({
  url: `${typeof window !== 'undefined' ? window.location.origin : BASE_URL}/rpc`,
  headers: async () => {
    if (typeof window !== 'undefined') {
      return {}
    }
    const { headers } = await import('next/headers')
    return await headers()
  },
})

/**
 * Fallback to client-side client if server-side client is not available.
 */
export const client: RouterClient<typeof router> = globalThis.$client ?? createORPCClient(link)
