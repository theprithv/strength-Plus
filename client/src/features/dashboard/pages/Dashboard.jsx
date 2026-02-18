import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../../context/AuthContext";
import "../styles/dashboard.css";
import BodyHeatmap from "../components/BodyHeatmap";
import QuickStats from "../components/QuickStats";
import { 
  getMuscleStats, 
  getYearCalendar, 
  getTrainingLoad, 
  getMuscleOverloadTrend, 
  getMuscleBalance 
} from "../../../services/dashboardApi";
import YearHeatmapSVG from "../components/yearCalendar/YearHeatmapSVG";
import YearCalendarHeader from "../components/yearCalendar/YearCalendarHeader";
import GeminiInsightsPanel from "../components/GeminiInsightsPanel";
import TrainingLoadChart from "../components/TrainingLoadChart";
import MuscleSetsChart from "../components/MuscleSetsChart";
import MuscleOverloadChart from "../components/MuscleOverloadChart";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  
  // Helper for synchronous state hydration
  const getCachedData = (key) => {
    if (!user?.id) return null;
    try {
      const cached = sessionStorage.getItem(`dash_${user.id}_${key}`);
      return cached ? JSON.parse(cached) : null;
    } catch { return null; }
  };

  // -- Global Dashboard State --
  const [refreshKey, setRefreshKey] = useState(0);

  // Year Calendar
  const [year, setYear] = useState(new Date().getFullYear());
  const [yearData, setYearData] = useState(() => getCachedData(`year_${year}`));

  // Training Load
  const [loadRange, setLoadRange] = useState("week");
  const [loadData, setLoadData] = useState(() => getCachedData(`load_${loadRange}`));

  // Muscle Overload
  const [overloadMuscle, setOverloadMuscle] = useState("chest");
  const [overloadRange, setOverloadRange] = useState(30);
  const [overloadData, setOverloadData] = useState(() => getCachedData(`overload_${overloadMuscle}_${overloadRange}`));

  // Muscle Balance (Sets)
  const [balanceData, setBalanceData] = useState(() => getCachedData("balance"));

  // Loading State - Initialized based on cache availability for immediate render
  const [isLoading, setIsLoading] = useState(() => {
    return !(yearData && loadData && overloadData && balanceData);
  });

  // Hover Interactions
  const [hoveredMuscle, setHoveredMuscle] = useState(null);
  const [muscleStats, setMuscleStats] = useState(null);
  const statsCacheRef = useRef({});
  const [lockedMuscle, setLockedMuscle] = useState(null);
  const heatmapRef = useRef(null);

  // -- Initial Data Fetching (Parallel) --
  
  // Helper for caching
  const fetchWithCache = async (key, fetcher) => {
    if (!user?.id) return null;
    const storageKey = `dash_${user.id}_${key}`;
    const cached = sessionStorage.getItem(storageKey);
    if (cached) return JSON.parse(cached);
    
    try {
      const data = await fetcher();
      sessionStorage.setItem(storageKey, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error(`Failed to fetch ${key}`, error);
      return null;
    }
  };

  // Listen for global data mutations (e.g. logging a set) to invalidate cache
  useEffect(() => {
    const handleMutation = () => {
      // Clear all dashboard cache
      try {
        Object.keys(sessionStorage).forEach((key) => {
          if (key.startsWith("dash_")) {
            sessionStorage.removeItem(key);
          }
        });
      } catch (e) {
        console.warn("Failed to clear dashboard cache", e);
      }
      // Force re-fetch
      setRefreshKey((prev) => prev + 1);
    };

    window.addEventListener("api-mutation-success", handleMutation);
    return () => window.removeEventListener("api-mutation-success", handleMutation);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const fetchInitialData = async () => {
      try {
        const [
          calendarRes,
          loadRes,
          overloadRes,
          balanceRes
        ] = await Promise.all([
          fetchWithCache(`year_${year}`, () => getYearCalendar(year)),
          fetchWithCache(`load_${loadRange}`, () => getTrainingLoad(loadRange)),
          fetchWithCache(`overload_${overloadMuscle}_${overloadRange}`, () => getMuscleOverloadTrend(overloadMuscle, overloadRange)),
          fetchWithCache(`balance`, () => getMuscleBalance("week"))
        ]);

        setYearData(calendarRes);
        setLoadData(loadRes);
        setOverloadData(overloadRes);
        setBalanceData(balanceRes);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
        // Signal that the dashboard is ready for the global loader to be removed
        window.dispatchEvent(new Event("dashboard-ready"));
      }
    };

    fetchInitialData();
  }, [user, refreshKey]); // Runs on mount and whenever cache is invalidated

  // -- Individual Updates for Filters --

  // Year Change
  useEffect(() => {
    if (!user?.id || isLoading) return;
    fetchWithCache(`year_${year}`, () => getYearCalendar(year)).then(setYearData);
  }, [year]);

  // Load Range Change
  useEffect(() => {
    if (!user?.id || isLoading) return;
    fetchWithCache(`load_${loadRange}`, () => getTrainingLoad(loadRange)).then(setLoadData);
  }, [loadRange]);

  // Overload Filters Change
  useEffect(() => {
    if (!user?.id || isLoading) return;
    fetchWithCache(`overload_${overloadMuscle}_${overloadRange}`, () => getMuscleOverloadTrend(overloadMuscle, overloadRange)).then(setOverloadData);
  }, [overloadMuscle, overloadRange]);

  // -- Interaction Logic --
  useEffect(() => {
    if (!hoveredMuscle || !user?.id) {
      setMuscleStats(null);
      return;
    }

    const cacheKey = `${hoveredMuscle}`;

    if (statsCacheRef.current[cacheKey]) {
      setMuscleStats(statsCacheRef.current[cacheKey]);
      return;
    }

    getMuscleStats(hoveredMuscle, "week")
      .then((data) => {
        statsCacheRef.current[cacheKey] = data;
        setMuscleStats(data);
      })
      .catch(() => {
        setMuscleStats(null);
      });
  }, [hoveredMuscle, user]);

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
      const clickedMuscle = e.target.closest?.("[data-muscle]");
      if (clickedMuscle) return;
      setLockedMuscle(null);
      setHoveredMuscle(null);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [lockedMuscle]);

  const handleHeatmapEmptyClick = () => {
    setLockedMuscle(null);
    setHoveredMuscle(null);
    setOverloadMuscle("chest"); // Reset overload chart to default maybe? Or keep state.
  };

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
          <TrainingLoadChart 
            data={loadData} 
            range={loadRange} 
            setRange={setLoadRange} 
          />
        </div>

        {/* MUSCLE BALANCE (RADAR CHART) */}
        <div style={{ marginTop: "12px" }}>
          <MuscleSetsChart 
            initialData={balanceData} 
          />
        </div>

        {/* MUSCLE OVERLOAD CHART */}
        <div style={{ marginTop: "12px" }}>
          <MuscleOverloadChart 
            data={overloadData}
            muscle={overloadMuscle}
            setMuscle={setOverloadMuscle}
            range={overloadRange}
            setRange={setOverloadRange}
          />
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
          {/* QuickStats Range Toggle removed or managed internally? 
              The original code had a range toggle here for QuickStats. 
              Let's keep it but manage state locally or global? 
              Original: const [range, setRange] = useState("week"); 
              It was interacting with `getMuscleStats(..., range)`.
              I'll keep a local range for QuickStats to avoid complexity.
          */}
           <QuickStatsWrapper 
             hoveredMuscle={hoveredMuscle} 
             lockedMuscle={lockedMuscle}
             user={user}
           />
        </div>
      </aside>
    </div>
  );
};

// Extracted for cleaner Dashboard logic (since QuickStats has its own small toggle)
const QuickStatsWrapper = ({ hoveredMuscle, lockedMuscle, user }) => {
  const [range, setRange] = useState("week");
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
     if (!hoveredMuscle) {
       setStats(null);
       return;
     }
     getMuscleStats(hoveredMuscle, range).then(setStats).catch(() => setStats(null));
  }, [hoveredMuscle, range, user]);

  return (
    <>
      <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>
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
       <QuickStats muscle={hoveredMuscle} stats={stats} range={range} />
    </>
  );
};

export default Dashboard;
