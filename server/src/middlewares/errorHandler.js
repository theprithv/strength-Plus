/**
 * Global Error Handling Middleware
 * Ensures production safety by masking stack traces and providing consistent JSON responses.
 */
import config from "../config/env.js";
import logger from "../config/logger.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  logger.error(`[Error] ${err.message}`);
  if (config.isDev) {
    logger.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: config.isDev
      ? err.message
      : "An unexpected error occurred. Please try again later.",
    stack: config.isDev ? err.stack : "🥞",
  });
};

export default errorHandler;
