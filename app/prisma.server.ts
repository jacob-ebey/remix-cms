import { PrismaClient } from "@prisma/client";

declare global {
  var prismaClient: PrismaClient;
}

export const prisma = (global.prismaClient =
  global.prismaClient || new PrismaClient());
