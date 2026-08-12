import prisma from "../config/prisma.js";
import config from "../config/env.js";
import logger from "../config/logger.js";

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
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.openRouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": config.clientUrl,
        "X-Title": "Strength Plus",
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4-5",
        messages: [
          {
            role: "user",
            content: `You are a professional strength training analyst.

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
${JSON.stringify(payload, null, 2)}`,
          },
        ],
        max_tokens: 512,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const status = response.status;
      if (status === 429) {
        logger.warn("OpenRouter quota exceeded — check your rate limits at https://openrouter.ai");
      } else if (status === 404) {
        logger.warn("OpenRouter model not found — verify model name in gemini.service.js");
      } else {
        logger.error(`OpenRouter error ${status}: ${err?.error?.message || response.statusText}`);
      }
      insights = FALLBACK_INSIGHTS;
    } else {
      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content ?? "";

      insights = text
        .split(/<INSIGHT>|\n\n/)
        .map((b) => b.trim())
        .filter((b) => b.length > 20)
        .slice(0, 3);

      if (insights.length < 3) {
        logger.warn(`OpenRouter returned only ${insights.length} valid insights. Using fallback.`);
        insights = FALLBACK_INSIGHTS;
      }
    }
  } catch (err) {
    logger.error(`OpenRouter fetch error: ${err.message}`);
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
