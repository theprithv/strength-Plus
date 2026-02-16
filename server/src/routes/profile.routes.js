import express from "express";
import { createProfile, getProfile, updateProfile, getDurationStats } from "../controllers/profile.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { upsertProfileBody, durationStatsQuery } from "../schemas/profile.schema.js";

const router = express.Router();

router.post("/", protect, validate({ body: upsertProfileBody }), createProfile);
router.get("/", protect, getProfile);
router.put("/", protect, validate({ body: upsertProfileBody }), updateProfile);
router.get("/duration-stats", protect, validate({ query: durationStatsQuery }), getDurationStats);

export default router;
