import { getRedis } from "@/lib/redis";
import { os } from "@orpc/server";
import { redis } from "bun";


export const ONE_MINUTE = 60;
export const ONE_HOUR = 60 * ONE_MINUTE;
export const ONE_DAY = 24 * ONE_HOUR;
export const cacheMiddleware = ({ ttl = ONE_HOUR }: { ttl?: number }) =>
  os.middleware(async ({ context, next, path }, input, output) => {
    const cacheKey = path.join("/") + JSON.stringify(input);

    const cached = await redis.get(cacheKey);

    if (cached) {
      return output(JSON.parse(cached));
    }
    const result = await next({});

    await redis.set(cacheKey, JSON.stringify(result.output), "EX", ttl);

    return result;
  });
