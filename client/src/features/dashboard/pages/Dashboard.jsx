import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../../context/AuthContext";
import "../styles/dashboard.css";
import BodyHeatmap from "../components/BodyHeatmap";
import QuickStats from "../components/QuickStats";
import { getMuscleStats } from "../../../services/dashboardApi";
import YearHeatmapSVG from "../components/yearCalendar/YearHeatmapSVG";
import YearCalendarHeader from "../components/yearCalendar/YearCalendarHeader";
import { getYearCalendar } from "../../../services/dashboardApi";
import GeminiInsightsPanel from "../components/GeminiInsightsPanel";
import TrainingLoadChart from "../components/TrainingLoadChart";
import MuscleSetsChart from "../components/MuscleSetsChart";
import MuscleOverloadChart from "../components/MuscleOverloadChart";


const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [hoveredMuscle, setHoveredMuscle] = useState(null);
  const [muscleStats, setMuscleStats] = useState(null);
  const [range, setRange] = useState("week");
  const statsCacheRef = useRef({});
  const [lockedMuscle, setLockedMuscle] = useState(null);
  const heatmapRef = useRef(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [yearData, setYearData] = useState(null);

  useEffect(() => {
    if (!hoveredMuscle || !user?.id) {
      setMuscleStats(null);
      return;
    }

    const cacheKey = `${hoveredMuscle}_${range}`;

    if (statsCacheRef.current[cacheKey]) {
      setMuscleStats(statsCacheRef.current[cacheKey]);
      return;
    }

    getMuscleStats(hoveredMuscle, range)
      .then((data) => {
        statsCacheRef.current[cacheKey] = data;
        setMuscleStats(data);
      })
      .catch(() => {
        setMuscleStats(null);
      });
  }, [hoveredMuscle, range, user]);

  const handleMuscleClick = (muscle) => {
    if (lockedMuscle === muscle) {
      setLockedMuscle(null);
      setHoveredMuscle(null);
    } else {
      setLockedMuscle(muscle);
      setHoveredMuscle(muscle);
    }
  };

  useEffect(() => {
    if (!lockedMuscle) return;

    const handleOutsideClick = (e) => {
      // If click happened on ANY muscle path → ignore
      const clickedMuscle = e.target.closest?.("[data-muscle]");
      if (clickedMuscle) return;

      // Otherwise → unlock
      setLockedMuscle(null);
      setHoveredMuscle(null);
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [lockedMuscle]);

  const handleHeatmapEmptyClick = () => {
    setLockedMuscle(null);
    setHoveredMuscle(null);
  };

  useEffect(() => {
    getYearCalendar(year).then((data) => {
      setYearData(data);
    });
  }, [year]);

  return (
    <div className="dashboard-layout">
      {/* CENTER SCROLLING COLUMN */}
      <div className="dashboard-center">
        {/* AI Greeting + Suggestions */}
        <section className="section ai-section">
          <GeminiInsightsPanel />
        </section>

        <section className="section calendar-section">
          {yearData && (
            <>
              <YearCalendarHeader
                year={yearData.year}
                availableYears={yearData.availableYears}
                currentStreak={yearData.currentStreak}
                longestStreak={yearData.longestStreak}
                onYearChange={setYear}
              />

              <YearHeatmapSVG
                year={yearData.year}
                trainedDays={yearData.trainedDays}
              />
            </>
          )}
        </section>

        {/* WEEKLY VOLUME (LINE CHART) */}
        <div>
          <TrainingLoadChart />
        </div>

        {/* MUSCLE BALANCE (RADAR CHART) */}
        <div style={{ marginTop: "12px" }}>
          <MuscleSetsChart />
        </div>

        {/* MUSCLE OVERLOAD CHART */}
        <div style={{ marginTop: "12px" }}>
          <MuscleOverloadChart />
        </div>
      </div>

      {/* RIGHT FIXED COLUMN (HEATMAP SPACE) */}
      <aside className="dashboard-right">
        <div className="heatmap-card" ref={heatmapRef}>
          <div className="section-header">Muscle Activity</div>
          <BodyHeatmap
            onHoverMuscle={(muscle) => {
              if (!lockedMuscle) setHoveredMuscle(muscle);
            }}
            onClickMuscle={handleMuscleClick}
            onEmptyClick={handleHeatmapEmptyClick}
            lockedMuscle={lockedMuscle}
          />
        </div>

        <div className="stats-card">
          <div className="section-header">Quick Stats</div>
          <div
            style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}
          >
            <span
              style={{
                cursor: "pointer",
                color: range === "week" ? "#fff" : "#6b7280",
                fontWeight: range === "week" ? 600 : 400,
              }}
              onClick={() => setRange("week")}
            >
              Week
            </span>
            {" | "}
            <span
              style={{
                cursor: "pointer",
                color: range === "month" ? "#fff" : "#6b7280",
                fontWeight: range === "month" ? 600 : 400,
              }}
              onClick={() => setRange("month")}
            >
              Month
            </span>
          </div>
          <QuickStats
            muscle={hoveredMuscle}
            stats={muscleStats}
            range={range}
          />
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;
