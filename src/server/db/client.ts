// src/server/db/client.ts
import dynamic from "next/dynamic.js";
import { PrismaClient } from "@prisma/client";
const env = dynamic(() => import("../../env/server.mjs") as any) // Can't find a good fix for this yet

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
