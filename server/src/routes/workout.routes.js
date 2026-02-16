import express from "express";
import {
  startWorkout,
  addExerciseToWorkout,
  addSetToExercise,
  finishWorkout,
  getActiveWorkout,
  getWorkoutsByDate,
  removeExerciseFromWorkout,
  updateWorkoutExercise,
  updateSet,
  deleteSet,
  getAllWorkouts,
} from "../controllers/workout.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  startWorkoutBody,
  addExerciseParams,
  addExerciseBody,
  addSetParams,
  addSetBody,
  finishWorkoutParams,
  exerciseIdParams,
  updateWorkoutExerciseBody,
  setIdParams,
  updateSetBody,
  dateParams,
} from "../schemas/workout.schema.js";

const router = express.Router();

router.post("/start", protect, validate({ body: startWorkoutBody }), startWorkout);
router.post("/:workoutId/exercises", protect, validate({ params: addExerciseParams, body: addExerciseBody }), addExerciseToWorkout);
router.post("/exercises/:workoutExerciseId/sets", protect, validate({ params: addSetParams, body: addSetBody }), addSetToExercise);
router.post("/:workoutId/finish", protect, validate({ params: finishWorkoutParams }), finishWorkout);
router.get("/active", protect, getActiveWorkout);
router.delete("/exercises/:id", protect, validate({ params: exerciseIdParams }), removeExerciseFromWorkout);
router.patch("/exercises/:id", protect, validate({ params: exerciseIdParams, body: updateWorkoutExerciseBody }), updateWorkoutExercise);
router.patch("/sets/:setId", protect, validate({ params: setIdParams, body: updateSetBody }), updateSet);
router.delete("/sets/:setId", protect, validate({ params: setIdParams }), deleteSet);
router.get("/by-date/:date", protect, validate({ params: dateParams }), getWorkoutsByDate);
router.get("/", protect, getAllWorkouts);

export default router;
