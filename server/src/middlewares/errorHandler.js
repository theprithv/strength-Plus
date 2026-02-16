/**
 * Global Error Handling Middleware
 * Ensures production safety by masking stack traces and providing consistent JSON responses.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error(`[Error] ${err.message}`);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === "production" 
      ? "An unexpected error occurred. Please try again later." 
      : err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

export default errorHandler;
