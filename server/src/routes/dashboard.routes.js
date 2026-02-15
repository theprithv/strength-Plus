import express from "express";
import { getMuscleStatsController } from "../controllers/dashboardController.js";
import { getCalendar } from "../controllers/calendarController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getYearCalendar } from "../controllers/calendarYearController.js";
import { getTrainingLoadController } from "../controllers/dashboardController.js";
import { getMuscleBalanceController } from "../controllers/dashboardController.js";
import { getMuscleOverloadController } from "../controllers/dashboardController.js";


const router = express.Router();

router.get("/muscle-stats", protect, getMuscleStatsController);
router.get("/calendar", protect, getCalendar);
router.get("/calendar/year", protect, getYearCalendar);
router.get("/training-load", protect, getTrainingLoadController);
router.get("/muscle-balance", protect, getMuscleBalanceController);
router.get("/muscle-overload", protect, getMuscleOverloadController);

export default router;
