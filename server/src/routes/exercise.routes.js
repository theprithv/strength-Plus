import express from "express";
import {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
  getExerciseStats,
  getExerciseHistory,
  getExercisePR,
} from "../controllers/exercise.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createExerciseBody,
  updateExerciseParams,
  updateExerciseBody,
  exerciseIdParams,
} from "../schemas/exercise.schema.js";

const router = express.Router();

router.get("/", protect, getExercises);
router.post("/", protect, validate({ body: createExerciseBody }), createExercise);
router.put("/:id", protect, validate({ params: updateExerciseParams, body: updateExerciseBody }), updateExercise);
router.delete("/:id", protect, validate({ params: exerciseIdParams }), deleteExercise);
router.get("/:id/stats", protect, validate({ params: exerciseIdParams }), getExerciseStats);
router.get("/:id/history", protect, validate({ params: exerciseIdParams }), getExerciseHistory);
router.get("/:id/pr", protect, validate({ params: exerciseIdParams }), getExercisePR);

export default router;
