import { getOrGenerateInsights } from "../services/gemini.service.js";
import config from "../config/env.js";

export const getMonthlyInsights = async (req, res, next) => {
  try {
    const forceRegen = config.isDev && req.query.force === "true";
    const result = await getOrGenerateInsights(req.user.id, forceRegen);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
