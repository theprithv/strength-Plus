import dotenv from "dotenv";

dotenv.config();

/**
 * Centralized environment configuration.
 * All environment variables should be accessed through this module.
 */
const config = {
  // Server
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  isDev: process.env.NODE_ENV !== "production",

  // Client
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  // Database
  databaseUrl: process.env.DATABASE_URL,

  // Authentication
  jwtSecret: process.env.JWT_SECRET,

  // Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID,

  // Gemini AI
  geminiApiKey: process.env.GEMINI_API_KEY,

  // Email (SMTP)
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

export default config;
