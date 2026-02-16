import express from "express";
import { startWorkout, addExerciseToWorkout, addSetToExercise, finishWorkout, getActiveWorkout, getWorkoutsByDate, removeExerciseFromWorkout, updateWorkoutExercise, updateSet, deleteSet, getAllWorkouts } from "../controllers/workouts/index.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/start", protect, startWorkout);
router.post("/:workoutId/exercises", protect, addExerciseToWorkout);
router.post("/exercises/:workoutExerciseId/sets", protect, addSetToExercise);
router.post("/:workoutId/finish", protect, finishWorkout);
router.get("/active", protect, getActiveWorkout);
router.delete("/exercises/:id", protect, removeExerciseFromWorkout);
router.patch("/exercises/:id", protect, updateWorkoutExercise);
router.patch("/sets/:setId", protect, updateSet);
router.delete("/sets/:setId", protect, deleteSet);
router.get("/by-date/:date", protect, getWorkoutsByDate);
router.get("/", protect, getAllWorkouts);


export default router;
