import express from "express";
import * as routineController from "../controllers/routines/index.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, routineController.createRoutine);
router.get("/", protect, routineController.getRoutines);
router.patch("/:id", protect, routineController.updateRoutine);

router.patch("/:id/set-current", protect, routineController.setCurrentRoutine);
router.delete("/:id", protect, routineController.deleteRoutine);

router.post("/:id/exercises", protect, routineController.addExerciseToRoutine);
router.post("/exercises/:id/sets", protect, routineController.addSetToRoutineExercise);

router.patch("/:id/reorder", protect, routineController.reorderRoutine);
router.get("/:id/exercises", protect, routineController.getRoutineExercises);
router.delete("/exercises/:id", protect, routineController.removeRoutineExercise);
router.delete("/:routineId/exercises/by-exercise/:exerciseId", protect, routineController.removeExerciseFromRoutineByExerciseId);

router.get("/current", protect, routineController.getCurrentRoutine);

export default router;
