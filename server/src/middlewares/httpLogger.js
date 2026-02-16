import morgan from "morgan";
import config from "../config/env.js";
import logger from "../config/logger.js";

const format = config.isDev
  ? "dev" // "GET /api/profile 401 12.345 ms - 23"
  : "combined"; // Standard Apache combined log format

const successHandler = morgan(format, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

const errorHandler = morgan(format, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});

export const httpLogger = {
  successHandler,
  errorHandler,
};
