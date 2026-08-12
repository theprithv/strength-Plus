import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const today = new Date().toISOString().slice(0, 10);
const deleted = await prisma.userDailyInsight.deleteMany({ where: { date: today } });
console.log(`Cleared ${deleted.count} cached AI insights for today (${today})`);
await prisma.$disconnect();
