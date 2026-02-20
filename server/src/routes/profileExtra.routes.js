import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getUserPanel,
  saveNote,
  removeNote,
  addTodo,
  patchTodo,
  removeTodo,
  updatePRSlot,
} from "../controllers/profileExtra.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  saveNoteBody,
  createTodoBody,
  todoIdParams,
  prSlotBody,
} from "../schemas/profileExtra.schema.js";

const router = express.Router();

router.get("/", protect, getUserPanel);

router.post("/note", protect, validate({ body: saveNoteBody }), saveNote);
router.delete("/note", protect, removeNote);

router.post("/todos", protect, validate({ body: createTodoBody }), addTodo);
router.patch("/todos/:id", protect, validate({ params: todoIdParams }), patchTodo);
router.delete("/todos/:id", protect, validate({ params: todoIdParams }), removeTodo);

router.post("/pr-slots", protect, validate({ body: prSlotBody }), updatePRSlot);

export default router;