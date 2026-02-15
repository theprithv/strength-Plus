import React, { useMemo, useState, useRef } from "react";

const ExerciseChart = ({
  data,
  dataKey,
  title,
  type = "line",
  color = "#38bdf8",
}) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const containerRef = useRef(null);

  // 1. Process Data & Geometry
  const {
    points,
    pathStr,
    bars,
    gridLines,
    dates,
    currentVal,
    bestVal,
    trend,
  } = useMemo(() => {
    if (!data || data.length < 2) return { gridLines: [], dates: [] };

    const values = data.map((d) => d[dataKey]);
    const max = Math.max(...values);
    const min = Math.min(...values);

    // Header Stats
    const current = values[values.length - 1];
    const best = max;
    const first = values[0];
    const diff = current - first;
    const trendLabel = diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : "0";
    const trendDir = diff > 0 ? "up" : diff < 0 ? "down" : "neutral";

    // Chart Scaling
    const buffer = (max - min) * 0.1 || 1;
    const effectiveMax = Math.ceil(max + buffer);
    const effectiveMin = Math.floor(min - buffer);
    const range = effectiveMax - effectiveMin || 1;

    const width = 100;
    const height = 50;

    // Generate Points (SVG Coordinates)
    const pts = values.map((val, i) => {
      const x = (i / (values.length - 1)) * width;
      const normalizedVal = (val - effectiveMin) / range;
      const y = height - normalizedVal * height;
      return { x, y, val, original: data[i] };
    });

    const pathString = pts.map((p) => `${p.x},${p.y}`).join(" ");

    // Generate Bars
    const barData = values.map((val, i) => {
      const normalizedVal = (val - effectiveMin) / range;
      const h = normalizedVal * height;
      const w = (width / values.length) * 0.6;
      const x = (i / values.length) * width + (width / values.length) * 0.2;
      const y = height - h;
      return { x, y, w, h, val };
    });

    // Grid Lines
    const gridSteps = [0, 0.25, 0.5, 0.75, 1];
    const gridLines = gridSteps
      .map((step) => {
        const value = Math.round(effectiveMin + range * step);
        const yPos = height - step * height;
        return { value, y: yPos };
      })
      .reverse();

    // Date Labels
    const dateLabels = data
      .map((d, i) => {
        const showLabel =
          data.length <= 6 ||
          i === 0 ||
          i === data.length - 1 ||
          i % Math.ceil(data.length / 5) === 0;
        if (!showLabel) return null;
        const dateObj = new Date(d.date);
        const label = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
        const leftPos = (i / (data.length - 1 || 1)) * 100;
        return {
          left: leftPos,
          label,
          isFirst: i === 0,
          isLast: i === data.length - 1,
        };
      })
      .filter((item) => item !== null);

    return {
      points: pts,
      pathStr: pathString,
      bars: barData,
      gridLines,
      dates: dateLabels,
      maxValue: max,
      minValue: min,
      currentVal: current,
      bestVal: best,
      trend: { label: trendLabel, dir: trendDir },
    };
  }, [data, dataKey]);

  // 2. Handle Mouse Hover
  const handleMouseMove = (e) => {
    if (!containerRef.current || !data || data.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const index = Math.round((x / width) * (data.length - 1));
    if (index >= 0 && index < data.length) {
      setHoverIndex(index);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  if (!data || data.length === 0)
    return <div className="empty-state">No data available</div>;

  const activePoint = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className="ex-chart-wrapper">
      {/* 1. HEADER SECTION */}
      <div className="ex-chart-header-area">
        <div className="ex-chart-title-group">
          <h3>{title}</h3>
          <div className="ex-chart-big-number">
            {currentVal}{" "}
            <span style={{ fontSize: "14px", color: "#555" }}>kg</span>
            <span className={`ex-chart-trend ${trend.dir}`}>
              {trend.dir === "up" ? "▲" : trend.dir === "down" ? "▼" : "—"}{" "}
              {trend.label}
            </span>
          </div>
        </div>
        <div className="ex-chart-best-badge">
          <span className="ex-chart-best-label">ALL TIME BEST</span>
          <span className="ex-chart-best-value">{bestVal} kg</span>
        </div>
      </div>

      <div className="ex-chart-body">
        {/* Y-AXIS */}
        <div className="ex-chart-y-axis">
          {gridLines.map((line, i) => (
            <span
              key={i}
              className="ex-chart-label"
              style={{ top: `${(line.y / 50) * 100}%` }}
            >
              {line.value}
            </span>
          ))}
        </div>

        {/* GRAPH CONTENT */}
        <div
          className="ex-chart-content"
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={(e) => handleMouseMove(e.touches[0])}
        >
          {/* TOOLTIP & INTERACTIVE HTML ELEMENTS */}
          {activePoint && (
            <>
              <div
                className="ex-cursor-line"
                style={{ left: `${(hoverIndex / (data.length - 1)) * 100}%` }}
              />
              <div
                className="ex-tooltip"
                style={{
                  left: `${(hoverIndex / (data.length - 1)) * 100}%`,
                  transform:
                    hoverIndex > data.length / 2
                      ? "translateX(-100%)"
                      : "translateX(0)",
                }}
              >
                <span className="ex-tooltip-date">
                  {new Date(activePoint.original.date).toLocaleDateString(
                    undefined,
                    { month: "short", day: "numeric" },
                  )}
                </span>
                <span className="ex-tooltip-value">{activePoint.val} kg</span>
              </div>
            </>
          )}

          {/* 👇 NEW: HTML DOTS LAYER (Perfect Circles) */}
          <div className="ex-dots-layer">
            {/* 1. PR DOTS */}
            {(type === "line" || type === "area") &&
              points.map((p, i) => {
                const isPR = p.val === bestVal;
                if (!isPR) return null;
                return (
                  <div
                    key={i}
                    className="ex-dot-pr"
                    style={{
                      left: `${p.x}%`,
                      top: `${(p.y / 50) * 100}%`,
                      borderColor: color,
                    }}
                  />
                );
              })}

            {/* 2. ACTIVE HOVER DOT */}
            {activePoint && (type === "line" || type === "area") && (
              <div
                className="ex-dot-active"
                style={{
                  left: `${activePoint.x}%`,
                  top: `${(activePoint.y / 50) * 100}%`,
                  borderColor: color,
                }}
              />
            )}
          </div>

          <svg
            viewBox="0 0 100 50"
            className="ex-chart-svg"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id={`grad-${dataKey}`}
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>

            {gridLines.map((line, i) => (
              <line
                key={i}
                x1="0"
                y1={line.y}
                x2="100"
                y2={line.y}
                stroke="#333"
                strokeWidth="0.3"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="50"
              stroke="#666"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />

            {/* Area & Line (No Circles inside SVG anymore) */}
            {type === "area" && (
              <polygon
                fill={`url(#grad-${dataKey})`}
                points={`0,50 ${pathStr} 100,50`}
              />
            )}
            {(type === "line" || type === "area") && (
              <polyline
                fill="none"
                stroke={color}
                strokeWidth="3"
                points={pathStr}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            )}

            {/* Bars */}
            {type === "bar" &&
              bars.map((b, i) => (
                <rect
                  key={i}
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={b.h}
                  fill={color}
                  rx="0.5"
                  opacity="0.8"
                />
              ))}
          </svg>

          {/* X-AXIS LABELS */}
          <div className="ex-chart-dates">
            {dates.map((d, i) => (
              <span
                key={i}
                className="ex-date-label"
                style={{
                  left: `${d.left}%`,
                  transform: d.isFirst
                    ? "translateX(0)"
                    : d.isLast
                      ? "translateX(-100%)"
                      : "translateX(-50%)",
                }}
              >
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseChart;
