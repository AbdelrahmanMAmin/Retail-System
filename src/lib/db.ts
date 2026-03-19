import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../generated/prisma";

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/retail_erp";

const globalForDb = globalThis as typeof globalThis & {
  db?: PrismaClient;
};

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
  });
}

export const db = globalForDb.db ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
