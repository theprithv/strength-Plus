import express from "express";
import * as routineController from "../controllers/routine.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createRoutineBody,
  updateRoutineParams,
  updateRoutineBody,
  routineIdParams,
  addExerciseBody,
  addSetBody,
  reorderBody,
  routineExercisesQuery,
  removeByExerciseParams,
} from "../schemas/routine.schema.js";

const router = express.Router();

router.post("/", protect, validate({ body: createRoutineBody }), routineController.createRoutine);
router.get("/", protect, routineController.getRoutines);
// Must precede /:id routes to avoid "current" matching as a param
router.get("/current", protect, routineController.getCurrentRoutine);

router.patch("/:id", protect, validate({ params: updateRoutineParams, body: updateRoutineBody }), routineController.updateRoutine);

router.patch("/:id/set-current", protect, validate({ params: routineIdParams }), routineController.setCurrentRoutine);
router.delete("/:id", protect, validate({ params: routineIdParams }), routineController.deleteRoutine);

router.post("/:id/exercises", protect, validate({ params: routineIdParams, body: addExerciseBody }), routineController.addExerciseToRoutine);
router.post("/exercises/:id/sets", protect, validate({ params: routineIdParams, body: addSetBody }), routineController.addSetToRoutineExercise);

router.patch("/:id/reorder", protect, validate({ params: routineIdParams, body: reorderBody }), routineController.reorderRoutine);
router.get("/:id/exercises", protect, validate({ params: routineIdParams, query: routineExercisesQuery }), routineController.getRoutineExercises);
router.delete("/exercises/:id", protect, validate({ params: routineIdParams }), routineController.removeRoutineExercise);
router.delete("/:routineId/exercises/by-exercise/:exerciseId", protect, validate({ params: removeByExerciseParams }), routineController.removeExerciseFromRoutineByExerciseId);

export default router;
