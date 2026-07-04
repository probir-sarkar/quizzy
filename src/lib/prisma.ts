import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

let prisma: PrismaClient;
declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = `${process.env.DATABASE_URL}`;

// Read CA certificate from file
const caCert = readFileSync(join(process.cwd(), 'ca.pem'), 'utf-8');

const adapter = new PrismaPg({
  connectionString,
  ssl: {
    rejectUnauthorized: true, // Enable proper certificate verification
    ca: caCert                // Use your CA certificate
  }
});

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    adapter
  });
} else {
  global.prisma ??= new PrismaClient({ adapter });
  prisma = global.prisma;
}

export default prisma;
