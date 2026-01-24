import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";
import { env } from "cloudflare:workers";

/**
 * Creates and returns a Prisma client instance configured for Cloudflare Workers.
 *
 * This function uses the `DATABASE_URL` environment variable to establish
 * a PostgreSQL connection using the PrismaPg adapter optimized for edge runtime.
 *
 * @returns A configured Prisma client instance
 * @throws Will throw an error if DATABASE_URL environment variable is not set
 *
 * @example
 * ```ts
 * const prisma = getPrisma();
 * const categories = await prisma.category.findMany();
 * ```
 *
 * @note This function creates a new Prisma client instance on each call.
 * For optimal performance in Cloudflare Workers, consider caching the client
 * instance if your use case allows it.
 */
export const getPrisma = () => {
  const connectionString = env.DATABASE_URL;
  const adapter = new PrismaPg({ connectionString });

  const prisma = new PrismaClient({
    adapter
  });

  return prisma;
};
