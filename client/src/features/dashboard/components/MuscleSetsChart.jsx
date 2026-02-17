import { useEffect, useState, useContext } from "react";
import { getMuscleBalance } from "../../../services/dashboardApi";
import { AuthContext } from "../../../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    // Sort exercises by set count descending
    const topExercises = Object.entries(data.rawExercises)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    return (
      <div className="muscle-sets-tooltip minimal">
        <p className="tooltip-title">{data.label}</p>

        <div className="tooltip-stats">
          <div className="tooltip-stat-row">
            <span>Week:</span> <strong>{data.weekSets} sets</strong>
          </div>
          <div className="tooltip-stat-row">
            <span>Month:</span> <strong>{data.monthSets} sets</strong>
          </div>
        </div>

        {topExercises.length > 0 && (
          <div className="tooltip-exercises">
            <p className="exercise-header">Top Exercises</p>
            {topExercises.map(([name, count]) => (
              <p key={name} className="exercise-text-item">
                • {name} — {count}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }
  return null;
};

const MuscleSetsChart = () => {
  const { user } = useContext(AuthContext);
  const [range, setRange] = useState("week"); // Default: Week
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const renderCustomBarLabel = ({ x, y, width, height, value }) => {
    return (
      <text
        x={x + width + 8}
        y={y + height / 2}
        fill="#525d6c"
        fillOpacity={1}
        dy={4}
        fontSize={12}
        fontWeight={500}
        letterSpacing={0.7}
      >
        {value} sets
      </text>
    );
  };

  useEffect(() => {
    if (!user?.id) return;
    getMuscleBalance(range).then((res) => {
      const formatted = Object.entries(res)
        .map(([key, stats]) => ({
          name: key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          displayValue: range === "week" ? stats.weekSets : stats.monthSets,
          weekSets: stats.weekSets,
          monthSets: stats.monthSets,
          rawExercises: stats.exercises,
        }))
        .filter((item) => item.displayValue > 0)
        .sort((a, b) => b.displayValue - a.displayValue);

      setChartData(formatted);
      setLoading(false);
    });
  }, [user, range]);

  if (loading)
    return <div className="chart-placeholder">Loading volume data...</div>;

  return (
    <div className="stats-card sets-chart-card">
      <div className="section-header">Training Sets</div>

      <div className="range-toggle-header">
        <span
          className={range === "week" ? "active" : ""}
          onClick={() => setRange("week")}
        >
        Week
        </span>
        <span className="separator">|</span>
        <span
          className={range === "month" ? "active" : ""}
          onClick={() => setRange("month")}
        >
        Month
        </span>
      </div>

      <div className="chart-container" style={{ width: "100%", minHeight: "150px" }}>
        {chartData.length === 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "150px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            No workouts logged
          </div>
        ) : (
          <ResponsiveContainer 
            width="100%" 
            height={Math.max(chartData.length * 40 + 40, 180)} 
            minWidth={0} 
            minHeight={0}
            debounce={50}
          >
            <BarChart
              layout="vertical"
              data={chartData}
              /* Increase right margin and add a small left margin for safety */
              margin={{ left: 10, right: 60, top: 0, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="label"
                type="category"
                tick={{
                  fill: "#9ca3af",
                  fontSize: 13,
                  fontWeight: 400,
                  textAnchor: "start",
                }}
                width={85}
                axisLine={false}
                tickLine={false}
                /* Lean labels closer to the bar start point */
                dx={-80}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar
                dataKey="displayValue"
                radius={[0, 4, 4, 0]}
                barSize={30}
                label={renderCustomBarLabel}
                minPointSize={6}
                animationDuration={400}
                activeBar={{
                  fill: "#7dd3fc",
                  stroke: "#7dd3fc",
                  strokeWidth: 1,
                  filter: "drop-shadow(0 0 4px rgba(56, 189, 248, 0.5))", // Soft glow
                }}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill="#38bdf8"
                    style={{ transition: "all 0.5s ease-in-out" }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default MuscleSetsChart;
