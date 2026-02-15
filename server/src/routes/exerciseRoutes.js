import express from "express";
import {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
  getExerciseStats,
  getExerciseHistory,
  getExercisePR,
} from "../controllers/exerciseController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getExercises);
router.post("/", protect, createExercise);
router.put("/:id", protect, updateExercise);
router.delete("/:id", protect, deleteExercise);
router.get("/:id/stats", protect, getExerciseStats);
router.get("/:id/history", protect, getExerciseHistory);
router.get("/:id/pr", protect, getExercisePR);

export default router;
