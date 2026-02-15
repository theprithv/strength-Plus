import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../config/prisma.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
const isDev = process.env.NODE_ENV !== "production";

const FALLBACK_INSIGHTS = [
  "Training analysis is temporarily unavailable today.",
  "Your workout data is being collected for the next update.",
  "Insights will refresh automatically tomorrow.",
];

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get("/monthly-insights", protect, async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().slice(0, 10);

  try {
    // 🔒 1. Check persisted daily insights (restart-safe)
    const forceRegen = isDev && req.query.force === "true";

    const existing = await prisma.userDailyInsight.findUnique({
      where: { userId },
    });

    if (!forceRegen && existing && existing.date === today) {
      return res.json({
        status: "ready",
        insights: existing.insights,
      });
    }

    // 📅 2. Gather workout data
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

    // 🔮 3. Gemini call
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

    let insights = rawBlocks.map((block) => {
      // normalize lines
      const lines = block
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      // force exactly 2 lines
      return lines.slice(0, 2).join("\n");
    });

    // 🔒 HARD GUARANTEE
    const isValidInsight = (text) => {
      const lines = text.split("\n").filter(Boolean);
      const charCount = text.length;

      return (
        charCount >= 80 && // enough substance (~2 lines)
        charCount <= 350 && // not an essay
        lines.length <= 3 // allow line wrapping
      );
    };

    if (insights.length !== 3 || insights.some((i) => !isValidInsight(i))) {
      insights = FALLBACK_INSIGHTS;
    }

    // 💾 4. Persist Gemini insights
    await prisma.userDailyInsight.upsert({
      where: { userId },
      update: {
        date: today,
        insights,
      },
      create: {
        userId,
        date: today,
        insights,
      },
    });

    return res.json({
      status: "ready",
      insights,
    });
  } catch (err) {
    // 🔕 Controlled logging
    if (err?.status === 429 || err?.status === 503) {
      console.warn("Gemini unavailable today, using fallback");
    } else {
      console.error("Gemini Insights Error:", err);
    }

    // 💾 Persist fallback (also restart-safe)
    await prisma.userDailyInsight.upsert({
      where: { userId },
      update: {
        date: today,
        insights: FALLBACK_INSIGHTS,
      },
      create: {
        userId,
        date: today,
        insights: FALLBACK_INSIGHTS,
      },
    });

    return res.json({
      status: "ready",
      insights: FALLBACK_INSIGHTS,
    });
  }
});

export default router;
