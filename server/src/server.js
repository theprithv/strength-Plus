import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import config from "./config/env.js";
import logger from "./config/logger.js";
import { httpLogger } from "./middlewares/httpLogger.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import profileExtraRoutes from "./routes/profileExtra.routes.js";
import exerciseRoutes from "./routes/exercise.routes.js";
import workoutRoutes from "./routes/workout.routes.js";
import routineRoutes from "./routes/routine.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import geminiRoutes from "./routes/gemini.routes.js";
import errorHandler from "./middlewares/errorHandler.js";

import { cleanupExpiredOTPs } from "./utils/otpCleanup.js";



const app = express();

// --- Production Middleware ---
app.use(helmet()); // Security headers
app.use(compression()); // Payload compression

// Configure CORS for production
const corsOptions = {
  origin: config.clientUrl,
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// --- Logging ---
app.use(httpLogger.successHandler);
app.use(httpLogger.errorHandler);

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/user-panel", profileExtraRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/routines", routineRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai/gemini", geminiRoutes);

app.get("/", (req, res) => {
  res.send("Strength+ API running");
});

// --- Global Error Handling ---
app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`Server running on ${PORT}`);
  
  // Run OTP cleanup once on startup and then every hour
  cleanupExpiredOTPs();
  setInterval(cleanupExpiredOTPs, 60 * 60 * 1000);
});
