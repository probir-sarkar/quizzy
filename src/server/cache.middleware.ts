import { getRedis } from "@/lib/redis";
import { os } from "@orpc/server";

export const ONE_MINUTE = 60;
export const ONE_HOUR = 60 * ONE_MINUTE;
export const ONE_DAY = 24 * ONE_HOUR;

// Prisma 8 decodes timestamp columns as Temporal values, which Next.js cannot
// pass from Server to Client Components (and which Redis caching would
// stringify anyway). Round-tripping through JSON makes every response plain —
// and identical whether it came from the cache, a miss, or a dev bypass.
const toPlainJson = <T>(value: T): T => JSON.parse(JSON.stringify(value));

export const cacheMiddleware = ({ ttl = ONE_HOUR }: { ttl?: number }) =>
  os.middleware(async ({ context, next, path }, input, output) => {
    if (process.env.NODE_ENV === "development") {
      const devResult = await next({});
      return output(toPlainJson(devResult.output));
    }

    const redis = getRedis();
    const cacheKey = path.join("/") + JSON.stringify(input);

    const cached = await redis.get(cacheKey);

    if (cached) {
      return output(JSON.parse(cached));
    }
    const result = await next({});

    await redis.set(cacheKey, JSON.stringify(result.output), "EX", ttl);

    return output(toPlainJson(result.output));
  });
