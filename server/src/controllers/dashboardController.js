import { getMuscleStats } from "../services/dashboardStats.service.js";
import { getTrainingLoad } from "../services/dashboardStats.service.js";
import { getMuscleBalance } from "../services/dashboardStats.service.js";
import { DASHBOARD_MUSCLES } from "../constants/dashboardMuscles.js";

function isValidationError(err) {
  const msg = err?.message || "";
  return msg.includes("Invalid") || msg.includes("Expected");
}

export async function getMuscleStatsController(req, res) {
  try {
    const userId = req.user.id;
    const { muscle, range = "week" } = req.query;

    if (!muscle || !DASHBOARD_MUSCLES.includes(muscle)) {
      return res.status(400).json({ error: "Invalid muscle" });
    }

    const stats = await getMuscleStats(userId, muscle, range);
    res.json(stats);
  } catch (err) {
    console.error("Muscle stats error:", err);
    const status = isValidationError(err) ? 400 : 500;
    const message = isValidationError(err) ? err.message : "Failed to fetch muscle stats";
    res.status(status).json({ error: message });
  }
}

export async function getTrainingLoadController(req, res) {
  try {
    const userId = req.user.id;
    const { range = "week" } = req.query;

    if (!["week", "month"].includes(range)) {
      return res.status(400).json({ error: "Invalid range" });
    }

    const data = await getTrainingLoad(userId, range);
    res.json(data);
  } catch (err) {
    console.error("Training load error:", err);
    const status = isValidationError(err) ? 400 : 500;
    const message = isValidationError(err) ? err.message : "Failed to fetch training load";
    res.status(status).json({ error: message });
  }
}

export async function getMuscleBalanceController(req, res) {
  try {
    const userId = req.user.id;
    const { range = "week" } = req.query;

    if (!["week", "month"].includes(range)) {
      return res.status(400).json({ error: "Invalid range" });
    }

    const balance = await getMuscleBalance(userId, range);
    res.json(balance);
  } catch (err) {
    console.error("Balance stats error:", err);
    const status = isValidationError(err) ? 400 : 500;
    const message = isValidationError(err) ? err.message : "Failed to fetch muscle balance";
    res.status(status).json({ error: message });
  }
}

export async function getMuscleOverloadController(req, res) {
  try {
    const userId = req.user.id;
    const { muscle, range = 30, exercise = "All" } = req.query;

    if (!muscle || !DASHBOARD_MUSCLES.includes(muscle)) {
      return res.status(400).json({ error: "Invalid muscle" });
    }

    const days = parseInt(range);
    if (isNaN(days) || days <= 0) {
      return res.status(400).json({ error: "Invalid range" });
    }

    // Calculate estimated 1RM trend over time
    const { getMuscleOverloadTrend } = await import("../services/dashboardStats.service.js");
    const data = await getMuscleOverloadTrend(userId, muscle, days, exercise);
    
    res.json(data);
  } catch (err) {
    console.error("Muscle overload error:", err);
    const status = isValidationError(err) ? 400 : 500;
    const message = isValidationError(err) ? err.message : "Failed to fetch overload trend";
    res.status(status).json({ error: message });
  }
}
