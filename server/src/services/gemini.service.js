import prisma from "../config/prisma.js";
import config from "../config/env.js";
import logger from "../config/logger.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const FALLBACK_INSIGHTS = [
  "Training analysis is temporarily unavailable today.",
  "Your workout data is being collected for the next update.",
  "Insights will refresh automatically tomorrow.",
];

/**
 * Get or generate daily AI training insights.
 * Returns cached insights if already generated today, otherwise calls Gemini API.
 */
export async function getOrGenerateInsights(userId, forceRegen = false) {
  const today = new Date().toISOString().slice(0, 10);

  // 1. Check persisted daily insights (restart-safe)
  const existing = await prisma.userDailyInsight.findFirst({
    where: { userId, date: today },
  });

  if (!forceRegen && existing) {
    return { status: "ready", insights: existing.insights };
  }

  // 2. Gather workout data
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const workouts = await prisma.workout.findMany({
    where: {
      userId,
      date: { gte: startOfMonth },
    },
    include: {
      exercises: {
        include: { exercise: true },
      },
    },
  });

  const muscles = {};

  workouts.forEach((w) => {
    w.exercises.forEach((we) => {
      let muscle = we.exercise?.primaryMuscle?.toLowerCase();
      if (!muscle) return;

      if (muscle === "upperback" || muscle === "lowerback") {
        muscle = "back";
      }

      if (!muscles[muscle]) {
        muscles[muscle] = {
          sets: 0,
          reps: 0,
          sessions: new Set(),
          lastTrained: w.date,
        };
      }

      muscles[muscle].sets += we.sets?.length || 0;
      muscles[muscle].reps += (we.sets || []).reduce((sum, s) => sum + (s.reps || 0), 0);
      muscles[muscle].sessions.add(w.id);

      if (w.date > muscles[muscle].lastTrained) {
        muscles[muscle].lastTrained = w.date;
      }
    });
  });

  Object.keys(muscles).forEach((m) => {
    muscles[m].sessions = muscles[m].sessions.size;
  });

  const payload = {
    month: `${now.getFullYear()}-${now.getMonth() + 1}`,
    muscles: Object.keys(muscles).length > 0 ? muscles : "No training data found for this period.",
  };

  // 3. Gemini call
  let insights = [];
  try {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({
      model: "models/gemini-3-flash-preview",
    });

    const prompt = `
You are a professional strength training analyst.

Analyze the training data below for this month. 

OUTPUT FORMAT (STRICT):
Return EXACTLY 3 insights.
Each insight MUST be 1-2 short lines.
Separate insights with the token: <INSIGHT>

Rules:
- Give technical, actionable feedback.
- Do not use markdown (no bold, no bullets).
- Do not explain yourself.

DATA:
${JSON.stringify(payload, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    insights = text
      .split(/<INSIGHT>|\n\n/)
      .map((b) => b.trim())
      .filter((b) => b.length > 20)
      .slice(0, 3);

    // Validate insights
    if (insights.length < 3) {
      logger.warn(`Gemini returned only ${insights.length} valid insights. Using fallback.`);
      insights = FALLBACK_INSIGHTS;
    }
  } catch (err) {
    logger.error(`Gemini Insights Error: ${err.message}`);
    insights = FALLBACK_INSIGHTS;
  }

  // 4. Persist insights (restart-safe)
  try {
    const existingEntry = await prisma.userDailyInsight.findFirst({
      where: { userId, date: today },
    });

    if (existingEntry) {
      await prisma.userDailyInsight.updateMany({
        where: { userId, date: today },
        data: { insights, updatedAt: new Date() },
      });
    } else {
      await prisma.userDailyInsight.create({
        data: { userId, date: today, insights },
      });
    }
  } catch (err) {
    logger.error(`Failed to save insights to DB: ${err.message}`);
  }

  return { status: "ready", insights };
}
