import { getCalendarWithStreaks } from "../services/calendar.service.js";
import logger from "../config/logger.js";

function isValidationError(err) {
  const msg = err?.message || "";
  return msg.includes("Invalid") || msg.includes("Expected");
}

export async function getCalendar(req, res) {
  try {
    const userId = req.user.id;
    const month = req.query.month;

    if (month === undefined || month === null || (typeof month === "string" && !month.trim())) {
      return res.status(400).json({ error: "month is required (YYYY-MM)" });
    }
    const monthStr = typeof month === "string" ? month.trim() : String(month);

    const data = await getCalendarWithStreaks(userId, monthStr);

    res.json(data);
  } catch (err) {
    logger.error(`Calendar fetch failed: ${err.message}`);
    const status = isValidationError(err) ? 400 : 500;
    const message = isValidationError(err) ? err.message : "Failed to fetch calendar data";
    res.status(status).json({ error: message });
  }
}
