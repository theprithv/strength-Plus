export function getDateRange(range = "week") {
  const now = new Date();
  const start = new Date(now);

  switch (range) {
    case "week":
      start.setDate(now.getDate() - 6);
      break;

    case "month":
      start.setDate(now.getDate() - 29);
      break;

    case "year":
      start.setDate(now.getDate() - 364);
      break;

    default:
      throw new Error("Invalid range");
  }

  start.setHours(0, 0, 0, 0);
  now.setHours(23, 59, 59, 999);

  return { start, end: now };
}
