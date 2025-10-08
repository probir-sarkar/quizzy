import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

let prisma: PrismaClient;

declare global {
  var prisma: PrismaClient | undefined;
}
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    adapter
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      adapter
    });
  }
  prisma = global.prisma;
}

export default prisma;
