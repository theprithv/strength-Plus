import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const user = await prisma.user.findUnique({ where: { email: "theprithv.2004@gmail.com" } });
console.log(`User ID: ${user.id}\n`);

const total = await prisma.workout.count({ where: { userId: user.id } });
const completed = await prisma.workout.count({ where: { userId: user.id, isCompleted: true } });
const incomplete = await prisma.workout.count({ where: { userId: user.id, isCompleted: false } });

console.log(`Total workouts    : ${total}`);
console.log(`isCompleted=true  : ${completed}`);
console.log(`isCompleted=false : ${incomplete}`);

// Date range breakdown
const byMonth = await prisma.$queryRaw`
  SELECT 
    TO_CHAR(date, 'YYYY-MM') as month,
    COUNT(*) as count,
    SUM(CASE WHEN "isCompleted" THEN 1 ELSE 0 END) as completed
  FROM "Workout"
  WHERE "userId" = ${user.id}
  GROUP BY TO_CHAR(date, 'YYYY-MM')
  ORDER BY month DESC
  LIMIT 20
`;

console.log("\nWorkouts by month (date field):");
byMonth.forEach(r => console.log(`  ${r.month}: total=${r.count} completed=${r.completed}`));

// Check startTime vs date mismatch
const sample = await prisma.workout.findMany({
  where: { userId: user.id, isCompleted: true },
  orderBy: { startTime: "desc" },
  take: 3,
  select: { date: true, startTime: true, isCompleted: true }
});
console.log("\nSample (startTime desc):");
sample.forEach(w => console.log(`  date=${w.date?.toISOString()} | startTime=${w.startTime?.toISOString()}`));

await prisma.$disconnect();
