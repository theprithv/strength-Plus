export function getMonthRange(month) {
  // month format: YYYY-MM
  if (typeof month !== "string" || !month.trim()) {
    throw new Error("Invalid month format. Expected YYYY-MM");
  }
  const [year, m] = month.trim().split("-").map(Number);

  if (!year || !m || m < 1 || m > 12 || Number.isNaN(year) || Number.isNaN(m)) {
    throw new Error("Invalid month format. Expected YYYY-MM (e.g. 2024-06)");
  }

  const start = new Date(year, m - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, m, 0, 23, 59, 59, 999);

  return { start, end };
}
