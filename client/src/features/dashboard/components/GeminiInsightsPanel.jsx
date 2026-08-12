import { useEffect, useState, useContext } from "react";
import { getGeminiInsights } from "../../../services/dashboardApi";
import { AuthContext } from "../../../context/AuthContext";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  if (hour >= 21 && hour <= 23) return "Night grind";
  return "Midnight grind";
}

export default function GeminiInsightsPanel() {
  const { user } = useContext(AuthContext);

  const [insights, setInsights] = useState([]);
  // status: "loading" | "ready" | "error"
  const [status, setStatus] = useState("loading");

  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");

  // phases: thinking → typing → pause → deleting
  const [phase, setPhase] = useState("thinking");

  const greeting = getGreeting();
  const name = user?.name || "Athlete";

  /* fetch once with daily cache */
  useEffect(() => {
    if (!user?.id) return;

    const today = new Date().toDateString();
    const cacheKey = `ai_insights_v3_${user.id}_${today}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      try {
        const data = JSON.parse(cached);
        // Only use cache if it has real content (≥3 insights)
        if (Array.isArray(data.insights) && data.insights.length >= 3) {
          setInsights(data.insights);
          setStatus("ready");
          return;
        }
      } catch (_) {
        // Bad JSON — fall through and refetch
      }
      sessionStorage.removeItem(cacheKey);
    }

    getGeminiInsights()
      .then((data) => {
        const list = data.insights || [];
        if (list.length > 0) {
          setInsights(list);
          setStatus("ready");
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [user]);

  /* main animation brain */
  useEffect(() => {
    if (status !== "ready" || !insights.length) return;

    const fullText = insights[index];
    let timer;

    switch (phase) {
      case "thinking":
        timer = setTimeout(() => {
          setPhase("typing");
        }, 1500);
        break;

      case "typing":
        if (text.length < fullText.length) {
          timer = setTimeout(() => {
            setText(fullText.slice(0, text.length + 1));
          }, 35);
        } else {
          setPhase("pause");
        }
        break;

      case "pause":
        timer = setTimeout(() => {
          setPhase("deleting");
        }, 3000); // 3s read time
        break;

      case "deleting":
        if (text.length > 0) {
          timer = setTimeout(() => {
            setText(text.slice(0, -1));
          }, 18); // fast reverse
        } else {
          setIndex((i) => (i + 1) % insights.length);
          setPhase("thinking");
        }
        break;

      default:
        break;
    }

    return () => clearTimeout(timer);
  }, [phase, text, index, insights, status]);

  const renderInsightArea = () => {
    if (status === "loading") {
      return <div className="gemini-placeholder">Analyzing your training data...</div>;
    }
    if (status === "error") {
      return <div className="gemini-placeholder">AI insights unavailable — check back soon.</div>;
    }
    // ready
    return (
      <div className="gemini-insight">
        <span className="gemini-text">{text}</span>
      </div>
    );
  };

  return (
    <div className="gemini-panel-premium">
      <div className="gemini-content-grid">
        {/* THE AI ORB */}
        <div className="gemini-avatar-area">
          <div className={`ai-orb ${phase}`}></div>
        </div>

        <div className="gemini-text-area">
          <div className="gemini-greeting">
            {greeting}, <span className="gemini-username">{name}</span>
          </div>

          {/* Insight area */}
          <div className="gemini-insight-wrapper">
            {renderInsightArea()}
          </div>
        </div>
      </div>

      {/* Keyframes for the Neural Pulse effect */}
      <style>
        {`
          @keyframes breathe {
            0%, 100% { transform: scale(0.85); opacity: 0.5; box-shadow: 0 0 5px #38bdf8; }
            50% { transform: scale(1.15); opacity: 1; box-shadow: 0 0 15px #38bdf8; }
          }
          @keyframes flicker {
            0% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 0.8; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}
