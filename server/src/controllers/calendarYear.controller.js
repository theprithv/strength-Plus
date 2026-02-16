import { getYearCalendarData } from "../services/calendarYear.service.js";
import logger from "../config/logger.js";

const MIN_YEAR = 2000;
const MAX_YEAR = 2100;

function isValidationError(err) {
  const msg = err?.message || "";
  return msg.includes("Invalid") || msg.includes("Expected");
}

function parseAndValidateYear(yearParam) {
  if (yearParam === undefined || yearParam === null || yearParam === "") {
    return undefined;
  }
  const year = parseInt(yearParam, 10);
  if (Number.isNaN(year) || year < MIN_YEAR || year > MAX_YEAR) {
    throw new Error(`Invalid year. Must be an integer between ${MIN_YEAR} and ${MAX_YEAR}.`);
  }
  return year;
}

export async function getYearCalendar(req, res) {
  try {
    const userId = req.user.id;
    const yearParam = req.query.year;
    const year = parseAndValidateYear(yearParam);

    const data = await getYearCalendarData(userId, year);
    res.json(data);
  } catch (err) {
    logger.error(`Year calendar fetch failed: ${err.message}`);
    const status = isValidationError(err) ? 400 : 500;
    const message = isValidationError(err) ? err.message : "Failed to fetch year calendar data";
    res.status(status).json({ error: message });
  }
}
