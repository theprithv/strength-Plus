import prisma from "../config/prisma.js";
import config from "../config/env.js";
import logger from "../config/logger.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const FALLBACK_INSIGHTS = [
  "Progressive overload is the key to strength gains — add small weight or reps each week to keep your muscles adapting.",
  "Recovery is where growth happens. Aim for 7–9 hours of sleep and at least one full rest day between heavy sessions.",
  "Compound lifts like squats, deadlifts, and bench press recruit the most muscle fibers — prioritize them for maximum strength gains.",
];

/**
 * Get or generate daily AI training insights.
 * Returns cached insights if already generated today, otherwise calls Gemini API.
 */
export async function getOrGenerateInsights(userId, forceRegen = false) {
  const today = new Date().toISOString().slice(0, 10);

  const existing = await prisma.userDailyInsight.findFirst({
    where: { userId, date: today },
  });

  if (!forceRegen && existing) {
    return { status: "ready", insights: existing.insights };
  }

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

  let insights = [];
  try {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
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

    if (insights.length < 3) {
      logger.warn(`Gemini returned only ${insights.length} valid insights. Using fallback.`);
      insights = FALLBACK_INSIGHTS;
    }
  } catch (err) {
    if (err.status === 429) {
      logger.warn("Gemini quota exceeded — check API key quota at https://ai.dev/rate-limit");
    } else if (err.status === 404) {
      logger.warn("Gemini model not found — verify model name in gemini.service.js");
    } else {
      logger.error(`Gemini error: ${err.message}`);
    }
    insights = FALLBACK_INSIGHTS;
  }

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
