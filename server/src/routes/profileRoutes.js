import express from "express";
import { createProfile, getProfile, updateProfile, getDurationStats } from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createProfile);
router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);
router.get("/duration-stats", protect, getDurationStats);

export default router;
