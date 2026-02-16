import {
  getProfileByUserId,
  updateProfileByUserId,
} from "../services/profile.service.js";
import prisma from "../config/prisma.js";
import logger from "../config/logger.js";
import { getDashboardStats } from "../services/dashboardStats.service.js";
import { getWorkoutDurationSeries } from "../services/profile.service.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await getProfileByUserId(userId);
    const stats = await getDashboardStats(userId);
    res.json({
      profile,
      stats: {
        totalWorkouts: stats.totalWorkouts || 0,
        totalSets: stats.totalSets || 0,
        totalReps: stats.totalReps || 0,
      },
    });
  } catch (error) {
    logger.error(`❌ PROFILE CONTROLLER ERROR: ${error.message}`);
    res.status(500).json({ message: "Profile failed" });
  }
};

export const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedProfile = await updateProfileByUserId(userId, req.body);
    res.json(updatedProfile);
  } catch (error) {
    logger.error(`❌ CREATE PROFILE ERROR: ${error.message}`);
    res.status(500).json({ message: "Failed to create profile" });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const updatedProfile = await updateProfileByUserId(userId, req.body);

    res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
};

export const updatePRSlot = async (req, res) => {
  const { slotIndex, exerciseId } = req.body;
  const userId = req.user.id;

  try {
    const updatedSlot = await prisma.userPRSlot.upsert({
      where: {
        userId_slotIndex: { userId, slotIndex },
      },
      update: { exerciseId },
      create: { userId, slotIndex, exerciseId },
    });
    res.json(updatedSlot);
  } catch (error) {
    res.status(500).json({ message: "Failed to update PR slot" });
  }
};

export const getDurationStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const days = parseInt(req.query.range) || 7;
    const data = await getWorkoutDurationSeries(userId, days);
    res.json(data);
  } catch (error) {
    logger.error(`❌ DURATION STATS ERROR: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch duration data" });
  }
};
