import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  const ex = await p.exercise.findMany({
    where: { name: { contains: 'Bench Press', mode: 'insensitive' } },
    select: { name: true }
  });
  console.log(JSON.stringify(ex, null, 2));
}
main().finally(() => p.$disconnect());
