import { PrismaClient } from "@prisma/client";

declare global {
  var _prisma: PrismaClient | undefined;
}

const prisma = globalThis._prisma || new PrismaClient(
  {
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }
);

if (process.env.NODE_ENV === "development") globalThis._prisma = prisma;

export default prisma;