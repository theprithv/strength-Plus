import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import prisma from "../config/prisma.js";

const router = express.Router();

// === GET / (Fetch note & recent todos) ===
router.get("/", protect, async (req, res) => {
  const userId = req.user.id;
  try {
    const [note, todos] = await Promise.all([
      prisma.highlightNote.findUnique({ where: { userId } }),
      prisma.weeklyTodo.findMany({
        where: {
          userId,
          // Optional: Filter by recent date if needed, but for now fetching all 
          // keeps it simple. Frontend filters by date buckets anyway.
          // We can optimize later if lists get huge.
          date: {
            gte: new Date(new Date().setDate(new Date().getDate() - 8)) // Last 8 days just to be safe
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    res.json({ note, todos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user panel data" });
  }
});

// === NOTE Routes ===

router.post("/note", protect, async (req, res) => {
  const { title, text } = req.body;
  const userId = req.user.id;

  try {
    const note = await prisma.highlightNote.upsert({
      where: { userId },
      update: { title, text },
      create: { userId, title, text }
    });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: "Failed to save note" });
  }
});

router.delete("/note", protect, async (req, res) => {
  const userId = req.user.id;
  try {
    await prisma.highlightNote.delete({ where: { userId } });
    res.json({ message: "Note deleted" });
  } catch (error) {
    // If doesn't exist, just ignore or 404. 
    // Prisma throws if not found? deleteMany is safer if unsure.
    // stick to delete with try/catch
    res.status(500).json({ error: "Failed to delete note" });
  }
});

// === TODO Routes ===

router.post("/todos", protect, async (req, res) => {
  const { text, date } = req.body;
  const userId = req.user.id;

  // Expect date in "YYYY-MM-DD"
  // Create a Date object from it. 
  // 'date' is likely "2023-10-10". confirm constructor works.
  
  try {
    const todo = await prisma.weeklyTodo.create({
      data: {
        userId,
        text,
        date: new Date(date), // Stores as timestamp (usually UTC midnight)
        isCompleted: false
      }
    });
    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

router.patch("/todos/:id", protect, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Since frontend sends no body to toggle, we must fetch first or raw query toggle.
    // Fetch first is easiest.
    const existing = await prisma.weeklyTodo.findUnique({ where: { id } });
    
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const updated = await prisma.weeklyTodo.update({
      where: { id },
      data: { isCompleted: !existing.isCompleted }
    });
    
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

router.delete("/todos/:id", protect, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Ensure ownership
    const existing = await prisma.weeklyTodo.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: "Todo not found" });
    }

    await prisma.weeklyTodo.delete({ where: { id } });
    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// === PR Slots (Existing) ===
router.post("/pr-slots", protect, async (req, res) => {
  const { slotIndex, exerciseId } = req.body;
  const userId = req.user.id;

  try {
    const updatedSlot = await prisma.userPRSlot.upsert({
      where: {
        userId_slotIndex: { userId, slotIndex }
      },
      update: { exerciseId },
      create: { userId, slotIndex, exerciseId }
    });
    res.json(updatedSlot);
  } catch (error) {
    res.status(500).json({ error: "Failed to update PR slot" });
  }
});

export default router;