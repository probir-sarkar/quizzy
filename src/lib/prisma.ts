import "temporal-polyfill/global";
import "temporal-polyfill/types/global";
import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "@/generated/prisma8/contract.js";
import contractJson from "@/generated/prisma8/contract.json" with { type: "json" };

const connectionString = process.env.DATABASE_URL!;

// Temporal-backed timestamp codecs decode/encode Temporal values; this
// converts a JS Date (UTC) to the PlainDateTime shape `timestamp` columns take.
export function asTimestamp(date: Date) {
  return date.toTemporalInstant().toZonedDateTimeISO("UTC").toPlainDateTime();
}

type Db = ReturnType<typeof createDb>;

declare global {
  var db: Db | undefined;
}

function createDb() {
  return postgres<Contract>({ url: connectionString, contractJson });
}

export const db: Db = globalThis.db ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalThis.db = db;
}
