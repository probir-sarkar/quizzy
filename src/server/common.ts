import type { Temporal } from "temporal-polyfill";
import { z } from "zod";

// Prisma 8 decodes timestamp columns as Temporal.PlainDateTime values, while
// cached/HTTP paths carry them as ISO strings. Output schemas accept both and
// transform to a plain string, so handlers type-check against what the DB
// returns and clients always receive serializable ISO strings.
export const isoDate = z
  .union([z.string(), z.custom<Temporal.PlainDateTime>((v) => v instanceof Object)])
  .transform((v) => v.toString());
