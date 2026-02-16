import prisma from "../config/prisma.js";
import config from "../config/env.js";
import logger from "../config/logger.js";

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
  const existing = await prisma.userDailyInsight.findUnique({
    where: { userId },
  });

  if (!forceRegen && existing && existing.date === today) {
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

      muscles[muscle].sets += we.sets || 0;
      muscles[muscle].reps += we.reps || 0;
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
    muscles,
  };

  // 3. Gemini call
  let insights;
  try {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({
      model: "models/gemini-3-flash-preview",
    });

    const prompt = `
You are a professional strength training analyst.

Analyze the MONTHLY muscle-level training data below.

OUTPUT FORMAT (STRICT — FOLLOW EXACTLY):

Return EXACTLY 3 insights.
Each insight MUST be approximately 2 short lines.
Each insight MUST be separated by the token: <INSIGHT>

Rules:
- Base everything ONLY on the provided data
- Each insight must cover a DIFFERENT idea
- Across all three insights, cover:
  • training balance or imbalance
  • frequency or recovery patterns
  • one actionable adjustment
- Do NOT merge ideas
- Do NOT use numbering, bullets, titles, or markdown
- Do NOT explain the format
- Plain text only

If data is limited, still produce three cautious insights based on what exists.

DATA:
${JSON.stringify(payload, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const rawBlocks = text
      .split("<INSIGHT>")
      .map((b) => b.trim())
      .filter(Boolean);

    insights = rawBlocks.map((block) => {
      const lines = block
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      return lines.slice(0, 2).join("\n");
    });

    // Validate insights
    const isValidInsight = (text) => {
      const lines = text.split("\n").filter(Boolean);
      const charCount = text.length;
      return charCount >= 80 && charCount <= 350 && lines.length <= 3;
    };

    if (insights.length !== 3 || insights.some((i) => !isValidInsight(i))) {
      insights = FALLBACK_INSIGHTS;
    }
  } catch (err) {
    // Controlled logging
    if (err?.status === 429 || err?.status === 503) {
      logger.warn("Gemini unavailable today, using fallback");
    } else {
      logger.error(`Gemini Insights Error: ${err.message}`);
    }
    insights = FALLBACK_INSIGHTS;
  }

  // 4. Persist insights (restart-safe)
  await prisma.userDailyInsight.upsert({
    where: { userId },
    update: { date: today, insights },
    create: { userId, date: today, insights },
  });

  return { status: "ready", insights };
}
