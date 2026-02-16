import express from "express";
import { getMuscleStatsController, getTrainingLoadController, getMuscleBalanceController, getMuscleOverloadController } from "../controllers/dashboard.controller.js";
import { getCalendar } from "../controllers/calendar.controller.js";
import { getYearCalendar } from "../controllers/calendarYear.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  muscleStatsQuery,
  calendarQuery,
  yearCalendarQuery,
  rangeQuery,
  muscleOverloadQuery,
} from "../schemas/dashboard.schema.js";

const router = express.Router();

router.get("/muscle-stats", protect, validate({ query: muscleStatsQuery }), getMuscleStatsController);
router.get("/calendar", protect, validate({ query: calendarQuery }), getCalendar);
router.get("/calendar/year", protect, validate({ query: yearCalendarQuery }), getYearCalendar);
router.get("/training-load", protect, validate({ query: rangeQuery }), getTrainingLoadController);
router.get("/muscle-balance", protect, validate({ query: rangeQuery }), getMuscleBalanceController);
router.get("/muscle-overload", protect, validate({ query: muscleOverloadQuery }), getMuscleOverloadController);

export default router;
