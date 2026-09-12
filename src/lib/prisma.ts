import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "@/generated/prisma8/contract.js";
import contractJson from "@/generated/prisma8/contract.json" with { type: "json" };
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;

// Prisma v7 client (legacy, for routes not yet migrated)
let prisma: PrismaClient;
declare global {
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaPg({ connectionString });

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ adapter });
} else {
  global.prisma ??= new PrismaClient({ adapter });
  prisma = global.prisma;
}

export default prisma;

// Prisma v8 ORM client (new, for migrated routes)
export const db = postgres<Contract>({ url: connectionString, contractJson });
