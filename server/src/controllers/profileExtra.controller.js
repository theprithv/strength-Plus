import {
  getUserPanelData,
  upsertNote,
  deleteNote,
  createTodo,
  toggleTodo,
  deleteTodo,
  upsertPRSlot,
} from "../services/profileExtra.service.js";

export const getUserPanel = async (req, res, next) => {
  try {
    const data = await getUserPanelData(req.user.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const saveNote = async (req, res, next) => {
  try {
    const { title, text } = req.body;
    const note = await upsertNote(req.user.id, title, text);
    res.json(note);
  } catch (error) {
    next(error);
  }
};

export const removeNote = async (req, res, next) => {
  try {
    await deleteNote(req.user.id);
    res.json({ message: "Note deleted" });
  } catch (error) {
    next(error);
  }
};

export const addTodo = async (req, res, next) => {
  try {
    const { text, date } = req.body;
    const todo = await createTodo(req.user.id, text, date);
    res.json(todo);
  } catch (error) {
    next(error);
  }
};

export const patchTodo = async (req, res, next) => {
  try {
    const result = await toggleTodo(req.user.id, req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const removeTodo = async (req, res, next) => {
  try {
    const result = await deleteTodo(req.user.id, req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo deleted" });
  } catch (error) {
    next(error);
  }
};

export const updatePRSlot = async (req, res, next) => {
  try {
    const { slotIndex, exerciseId } = req.body;
    const updatedSlot = await upsertPRSlot(req.user.id, slotIndex, exerciseId);
    res.json(updatedSlot);
  } catch (error) {
    next(error);
  }
};
