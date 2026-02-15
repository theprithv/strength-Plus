import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import prisma from "../config/prisma.js";

const router = express.Router();

router.get("/me", protect, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { workouts: true }
  });

  res.json(user);
});

export default router;
