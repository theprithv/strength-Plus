import { useState, useEffect, useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../services/api";
import { DASHBOARD_MUSCLES } from "../../constants/dashboardMuscles";

const MuscleOverloadChart = () => {
  const [muscle, setMuscle] = useState("chest"); // This was missing
  const [range, setRange] = useState(30);
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        // Exercise is now fixed to "All" as per your request to remove the slider
        const res = await api.get(`/dashboard/muscle-overload`, {
          params: { muscle, range, exercise: "All" },
        });
        setData(res.data.series || []);
      } catch (err) {
        console.error("Failed to fetch overload trend", err);
      }
    };
    fetchTrend();
  }, [muscle, range]);

  const currentPoint = data.length > 0 ? data[data.length - 1] : null;
  const prevPoint = data.length > 1 ? data[data.length - 2] : null;
  const delta =
    currentPoint && prevPoint ? currentPoint.score - prevPoint.score : 0;

  return (
    <div className="training-load-card overload-chart-card">
      <div className="chart-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 className="chart-title">Strength Progress</h3>
          {/* Range Toggle at Top Right */}
          <div className="chart-toggle">
            <span
              className={range === 30 ? "active" : ""}
              onClick={() => setRange(30)}
              style={{
                cursor: "pointer",
                color: range === 30 ? "#fff" : "#6b7280",
              }}
            >
              30D
            </span>
            <span style={{ color: "#4b5563", margin: "0 4px" }}>|</span>
            <span
              className={range === 90 ? "active" : ""}
              onClick={() => setRange(90)}
              style={{
                cursor: "pointer",
                color: range === 90 ? "#fff" : "#6b7280",
              }}
            >
              90D
            </span>
          </div>
        </div>

        <div
          className="controls-row"
          style={{ marginTop: "10px", paddingLeft: "7px" }}
        >
          <div className="custom-dropdown-container" ref={dropdownRef}>
            <div
              className="custom-dropdown-trigger"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span>{muscle}</span>
              <span
                style={{
                  fontSize: "10px",
                  transform: isOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
              >
                ▼
              </span>
            </div>

            {isOpen && (
              <div className="custom-dropdown-list hide-scroll">
                {DASHBOARD_MUSCLES.map((m) => (
                  <div
                    key={m}
                    className={`custom-dropdown-option ${muscle === m ? "active" : ""}`}
                    onClick={() => {
                      setMuscle(m);
                      setIsOpen(false);
                    }}
                  >
                    {m.toUpperCase()}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Progress Status Label */}
        {currentPoint && (
          <div style={{ marginTop: "6px", paddingLeft: "8px" }}>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color:
                  currentPoint.status === "up"
                    ? "#38bdf8"
                    : currentPoint.status === "down"
                      ? "#64748b"
                      : "#9ca3af",
                display: "flex",
                alignItems: "center",
              }}
            >
              {currentPoint.status === "up"
                ? "▲ Inclining"
                : currentPoint.status === "down"
                  ? "▼ Declining"
                  : "▬ Stable"}
              <div className="info-hint-wrapper">
                <svg
                  className="info-hint-svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 16V11"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="7.5" r="1" fill="currentColor" />
                </svg>
                  <div className="info-hint-content">
                  <p className="info-hint-title">How this chart works</p>
                  <ul>
                    <li>
                      The line shows your <strong>Estimated 1RM</strong>{" "}
                      (strength potential) for each period of time.
                    </li>
                    <li>
                      <strong>“Improving”</strong> means your calculated strength
                      score went up (e.g., more reps at same weight).
                    </li>
                    <li>
                      <strong>“Stable”</strong> means your strength output
                      remained consistent.
                    </li>
                    <li>
                      <strong>“Declining”</strong> means a drop in estimated
                      strength performance.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className="chart-container"
        style={{ height: "270px", marginTop: "10px", paddingLeft: "4px" }}
      >
        <ResponsiveContainer width="100%" height={270} minWidth={0} minHeight={0} debounce={50}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="dateLabel" // Maps to "Jan 1" or "Nov"
              stroke="#4b5563"
              fontSize={13.5}
              tickLine={false}
              axisLine={true}
              tickMargin={12.5}
              padding={{ left: 20, right: 20 }}
            />
            {/* Normalized Score Axis (0-100) */}
            <YAxis
              domain={["auto", "auto"]}
              stroke="#4b5563"
              fontSize={13.5}
              tickLine={false}
              axisLine={true}
              width={30}
              tickFormatter={(val) => `${val}kg`}
              padding={{ top: 10, bottom: 10 }}
            />
            <Tooltip content={<CustomTooltip range={range} />} />
            <Area
              type="linear"
              dataKey="score"
              stroke="#38bdf8"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorScore)"
              dot={{ r: 4, fill: "#38bdf8", strokeWidth: 0 }}
              activeDot={{
                r: 6,
                fill: "#fff",
                stroke: "#38bdf8",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, range }) => {
  if (active && payload && payload.length) {
    const { date, drivers, score, hasNewExercisesOnly } = payload[0].payload;
    const status = payload[0].payload.status || "flat";

    return (
      <div className="custom-chart-tooltip">
        <p className="tooltip-label">{date}</p>
        <p style={{ color: "#fff", fontSize: "#13px", marginBottom: "4px" }}>
          {range === 30
            ? `Est. Strength (Last 5 Days): ${score}kg`
            : `Est. Strength (Last 10 Days): ${score}kg`}
        </p>
        <p
          style={{
            fontWeight: "700",
            fontSize: "14px",
            color:
              status === "up"
                ? "#38bdf8"
                : status === "down"
                  ? "#64748b"
                  : "#9ca3af",
          }}
        >
          {status === "up"
            ? "Improvement Detected ✔"
            : status === "down"
              ? "Regression Detected"
              : "Stable (Plateau)"}
        </p>
        {drivers && drivers.length > 0 ? (
          <div
            className="tooltip-exercises"
            style={{
              marginTop: "8px",
              paddingTop: "8px",
              borderTop: "1px solid #1f2937",
            }}
          >
            <p
              className="exercise-header"
              style={{
                marginBottom: "6px",
                fontSize: "10px",
                color: "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Exercise Details:
            </p>
            {/* Show message if all exercises are new */}
            {hasNewExercisesOnly && (
              <p
                style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  marginBottom: "6px",
                  fontStyle: "italic",
                }}
              >
                No past exercises have improvements
              </p>
            )}
            {drivers
              .filter((driver) => {
                // For improvement/regression, exclude new exercises
                // For plateau/flat, show all exercises
                if (status === "up" || status === "down") {
                  return driver.status !== "new";
                }
                return true;
              })
              .map((driver, i) => {
              const { exercise, weight, reps, change, status: driverStatus } = driver;
              
              // Determine color based on status
              const statusColor =
                driverStatus === "improved"
                  ? "#38bdf8" 
                  : driverStatus === "declined"
                    ? "#64748b"
                    : driverStatus === "plateau"
                      ? "#4b5563" 
                      : "#9ca3af"; 
              
              // Format display text
              let displayText = `${exercise}  `;
              if (driverStatus === "improved") {
                displayText += `+${change}kg`;
              } else if (driverStatus === "declined") {
                displayText += `${change}kg`; // Already negative
              } else if (driverStatus === "plateau") {
                displayText += "Plateau";
              } else if (driverStatus === "new") {
                displayText += "New Exercise trained";
              }

              return (
                <p
                  key={i}
                  className="exercise-text-item"
                  style={{
                    fontSize: "12px",
                    color: statusColor,
                    marginBottom: "3px",
                    fontWeight: driverStatus === "new" ? "400" : "500",
                  }}
                >
                  • {displayText}
                </p>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }
  return null;
};

export default MuscleOverloadChart;

