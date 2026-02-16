import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import profileExtraRoutes from "./routes/profileExtraRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import routineRoutes from "./routes/routineRoutes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import geminiRoutes from "./routes/geminiRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

import { cleanupExpiredOTPs } from "./utils/otpCleanup.js";

dotenv.config();

const app = express();

// --- Production Middleware ---
app.use(helmet()); // Security headers
app.use(compression()); // Payload compression

// Configure CORS for production
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  
  // Run OTP cleanup once on startup and then every hour
  cleanupExpiredOTPs();
  setInterval(cleanupExpiredOTPs, 60 * 60 * 1000);
});
