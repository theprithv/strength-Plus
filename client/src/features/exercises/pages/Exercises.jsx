import "../styles/Exercises.css";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import Dropdown from "../../../components/layout/Dropdown";
import ExerciseLibraryContent from "../components/ExerciseLibraryContent";
import { getExerciseHistory } from "../../../services/exerciseApi";
import ExerciseChart from "../components/ExerciseChart";
import { MUSCLES, EQUIPMENT } from "../constants/exerciseOptions.js";

const formatLabel = (value = "") =>
  value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export default function Exercises({ pickerMode = false, onSelectExercise }) {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState({ bestLift: 0, lastPerformed: null });
  const [historyData, setHistoryData] = useState([]);
  const [chartMode, setChartMode] = useState("weight");
  const [exercisesError, setExercisesError] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };



  useEffect(() => {
    if (selectedExercise) {
      // Reset to loading state
      setStats({ bestLift: 0, lastPerformed: null });

      api
        .get(`/exercises/${selectedExercise.id}/stats`)
        .then((res) => {
          setStats(res.data);
        })
        .catch((err) => console.error("Stats fetch error", err));
    }
  }, [selectedExercise]);

  useEffect(() => {
    if (
      selectedExercise &&
      (activeTab === "history" || activeTab === "stats")
    ) {
      const fetchHistory = async () => {
        try {
          const data = await getExerciseHistory(selectedExercise.id);
          setHistoryData(data);
        } catch (err) {
          console.error("Failed to load history", err);
        }
      };
      fetchHistory();
    }
  }, [selectedExercise, activeTab]);



  return (
    <div
      className={`page-shell exercises-page ${pickerMode ? "picker-mode" : ""}`}
    >
      {exercisesError && (
        <p style={{ padding: "1rem 2rem", color: "#ef4444" }}>{exercisesError}</p>
      )}
      {/* ===== Main Viewer ===== */}
      {!pickerMode && (
        <div className="exercise-viewer">
          {selectedExercise && (
            <div className="exercise-hero">
              {/* LEFT: INFO */}
              <div className="exercise-info">
                <h1 className="hero-title">{selectedExercise.name}</h1>

                {/* NEW BADGES ROW */}
                <div className="exercise-badges">
                  <div className="badge primary">
                    <span className="badge-label">Target : </span>
                    <span className="badge-value">
                      {formatLabel(selectedExercise.primaryMuscle)}
                    </span>
                  </div>

                  <div className="badge equipment">
                    <span className="badge-label">Equipment : </span>
                    <span className="badge-value">
                      {formatLabel(selectedExercise.equipment)}
                    </span>
                  </div>

                  {selectedExercise.secondaryMuscles?.length > 0 && (
                    <div className="badge secondary">
                      <span className="badge-label">Secondary : </span>
                      <span className="badge-value">
                        {selectedExercise.secondaryMuscles
                          .slice(0, 2)
                          .map(formatLabel)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                {/* MINI STATS PREVIEW (Placeholder for future data) */}
                {/* MINI STATS PREVIEW */}
                {/* MINI STATS PREVIEW (New Design) */}
                {/* MINI STATS PREVIEW (Minimal List) */}
                {/* SINGLE LINE STATS ROW */}
                <div className="hero-stats-preview">
                  {/* 1. BEST PR STAT */}
                  <div className="stat-item">
                    <div className="stat-icon gold">
                      {/* Trophy Icon */}
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                        <path d="M4 22h16" />
                        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                      </svg>
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">All Time Best</span>
                      <span className="stat-value">
                        {stats.bestLift > 0 ? `${stats.bestLift} kg` : "0"}
                      </span>
                    </div>
                  </div>

                  {/* Vertical Divider Line */}
                  <div className="stat-divider"></div>

                  {/* 2. LAST LIFT STAT */}
                  <div className="stat-item">
                    <div className="stat-icon blue">
                      {/* Calendar Icon */}
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">Last Lift</span>
                      <span className="stat-value">
                        {stats.lastPerformed
                          ? new Date(stats.lastPerformed).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )
                          : "0"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: MEDIA CARD (With Vignette Fix) */}
              <div className="exercise-media-container">
                <div className="media-card">
                  {selectedExercise.imageUrl ? (
                    <video
                      key={selectedExercise.id}
                      src={selectedExercise.imageUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls={false}
                      className="exercise-video"
                    />
                  ) : (
                    <div className="image-placeholder">No Preview</div>
                  )}
                  {/* Overlay to dim the white background */}
                  <div className="vignette-overlay"></div>
                </div>
              </div>
            </div>
          )}

          {/* MODERN TABS */}
          <div className="exercise-tabs-container">
            <div className="exercise-tabs">
              {["stats", "history", "howto"].map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "howto" ? "How To" : formatLabel(tab)}
                </button>
              ))}
            </div>
          </div>

          <div className="exercise-content">
            {activeTab === "stats" && (
              <div
                className="stats-container"
              >
                {historyData.length > 1 ? (
                  <div className="charts-stack">
                    {/* Pre-calculate data once for all charts */}
                    {(() => {
                      const processedData = historyData
                        .map((log) => ({
                          ...log,
                          "1rm": Math.round(log.weight * (1 + log.reps / 30)),
                          volume: Math.round(log.weight * log.reps * log.sets),
                        }))
                        .reverse();

                      return (
                        <>
                          {/* 1. LOAD CHART (Blue) */}
                          <ExerciseChart
                            title="Load (Max Weight)"
                            data={processedData}
                            dataKey="weight"
                            type="line"
                            color="#38bdf8"
                          />

                          {/* 2. STRENGTH CHART (Blue) */}
                          <ExerciseChart
                            title="Strength (Est. 1RM)"
                            data={processedData}
                            dataKey="1rm"
                            type="area"
                            color="#38bdf8"
                          />

                          {/* 3. VOLUME CHART (Blue) */}
                          <ExerciseChart
                            title="Volume (Total Load)"
                            data={processedData}
                            dataKey="volume"
                            type="bar"
                            color="#38bdf8"
                          />
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>Complete at least 2 workouts to see trends.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div className="history-container">
                {historyData.length > 0 ? (
                  historyData.map((log, index) => (
                    <div key={index} className="history-item">
                      {/* Left: Date */}
                      <div className="history-date">
                        {new Date(log.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        <span className="history-year">
                          {new Date(log.date).getFullYear()}
                        </span>
                      </div>

                      {/* Middle: Performance */}
                      <div className="history-performance">
                        <span className="history-weight">{log.weight} kg</span>
                        <span className="history-x">×</span>
                        <span className="history-reps">{log.reps}</span>

                        {/* 🏆 PR Badge */}
                        {log.isPr && <span className="pr-badge">PR</span>}
                      </div>

                      {/* Right: Trend */}
                      <div
                        className={`history-trend ${
                          log.diff.includes("+") ? "gain" : "neutral"
                        }`}
                      >
                        {log.diff}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No history found for this exercise.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "howto" && (
              <div className="howto-container">
                {selectedExercise?.howToSteps?.length > 0 ? (
                  <div className="howto-list">
                    {selectedExercise.howToSteps.map((step, index) => (
                      <div key={index} className="howto-item">
                        <span className="howto-number">{index + 1}.</span>
                        <p className="howto-text">{step}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No instructions available.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== Library ===== */}
      <div className="exercise-library">
        <ExerciseLibraryContent
          onSelectExercise={(ex) => setSelectedExercise(ex)}
        />
      </div>
    </div>
  );
}
