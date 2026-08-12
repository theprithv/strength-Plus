import { getOrGenerateInsights } from "../services/gemini.service.js";
import config from "../config/env.js";

export const getMonthlyInsights = async (req, res, next) => {
  try {
    // Allow force-regen from any env so we can refresh stale cached insights
    const forceRegen = req.query.force === "true";
    const result = await getOrGenerateInsights(req.user.id, forceRegen);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
