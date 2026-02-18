import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
} from "recharts";
import { useMemo } from "react";

const TrainingLoadChart = ({ data = null, range, setRange }) => {
  // Removed enrichedData calculation to prevent "loading volume data" issue
  // We will use the raw 'data' prop directly.
  const chartData = data || [];

  return (
    <div className="training-load-card">
      <div className="chart-header">
        <h3 className="chart-title">Training Load</h3>
        <div
          className="chart-toggle"
          style={{ fontSize: "12px", color: "#9ca3af"}}
        >
          <span
            style={{
              cursor: "pointer",
              color: range === "week" ? "#fff" : "#6b7280",
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
            }}
            onClick={() => setRange("month")}
          >
            Month
          </span>
        </div>
      </div>

      <div
        className="chart-container"
        style={{ width: "100%", height: "260px", position: "relative" }}
      >
        {!data && chartData.length === 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <div className="chart-spinner"></div>
          </div>
        ) : chartData.length === 0 || chartData.every((item) => item.load === 0) ? (
          <div
            className="chart-placeholder"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            No workouts logged
          </div>
        ) : (
          /* FIX: We use a fixed height number (300) here to guarantee the chart renders */
          <ResponsiveContainer width="100%" height={270} minWidth={0} minHeight={0} debounce={50}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="period"
                scale="point"
                padding={{ left: 0, right: 0 }}
                stroke="#4b5563"
                tickLine={false}
                axisLine={false}
                tickMargin={13.5}
                tick={{ fontSize: 13.5 }}
                tickFormatter={(value) => {
                  if (range === "month") {
                    const [year, month] = value.split("-");
                    return `${year.slice(2)}-${month}`;
                  }
                  return value;
                }}
              />

              <YAxis
                stroke="#6b7280"
                fontSize={13.5}
                tickLine={false}
                axisLine={false}
                width={30}
                tickFormatter={(value) =>
                  value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
                }
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="custom-chart-tooltip">
                        <p className="tooltip-label">{label}</p>
                        <p className="tooltip-value">
                          Load: <span>{payload[0].value.toLocaleString()}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Area
                type="monotone"
                dataKey="load"
                stroke="none"
                fillOpacity={1}
                fill="url(#colorLoad)"
              />

              <Line
                type="monotone"
                dataKey="load"
                stroke="#38bdf8"
                strokeWidth={3}
                dot={{ r: 0 }}
                activeDot={{
                  r: 5,
                  stroke: "#38bdf8",
                  strokeWidth: 2,
                  fill: "#0b0b0b",
                }}
                filter="url(#glow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TrainingLoadChart;
