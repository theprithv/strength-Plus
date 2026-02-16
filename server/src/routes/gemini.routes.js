import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getMonthlyInsights } from "../controllers/gemini.controller.js";

const router = express.Router();

router.get("/monthly-insights", protect, getMonthlyInsights);

export default router;
