import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";
import { env } from "cloudflare:workers";

export const getPrisma = () => {
  const connectionString = env.DATABASE_URL;
  const adapter = new PrismaPg({ connectionString });

  const prisma = new PrismaClient({
    adapter
  });

  return prisma;
};
