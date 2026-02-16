const CELL = 10; // Slightly larger for better touch/visibility
const GAP = 3;
const MONTH_GAP = 12;
const RADIUS = 2;

const YearHeatmapSVG = ({ year, trainedDays }) => {
  const trainedSet = new Set(trainedDays);
  let cursorX = 0;
  const monthLabels = [];
  const cells = [];

  for (let month = 0; month < 12; month++) {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const daysInMonth = last.getDate();
    const startDay = first.getDay(); 

    const monthStartX = cursorX;

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const week = Math.floor((startDay + d - 1) / 7);
      const day = date.getDay();

      const x = cursorX + week * (CELL + GAP);
      const y = day * (CELL + GAP);

      const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

      cells.push({
        x, y,
        trained: trainedSet.has(iso),
        key: iso,
      });
    }

    // Label alignment: Position at the start of the month's first column
    monthLabels.push({
      x: monthStartX,
      label: new Date(year, month).toLocaleString("en", { month: "short" }),
    });

    const weeksInMonth = Math.ceil((startDay + daysInMonth) / 7);
    cursorX += weeksInMonth * (CELL + GAP) + (MONTH_GAP - GAP);
  }

  const svgWidth = cursorX - MONTH_GAP;
  const svgHeight = 7 * (CELL + GAP) - GAP;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight + 25}`}
      className="heatmap-svg-premium"
      preserveAspectRatio="xMidYMid meet"
    >
      {cells.map((c) => (
        <rect
          key={c.key}
          x={c.x}
          y={c.y}
          width={CELL}
          height={CELL}
          rx={RADIUS}
          ry={RADIUS}
          className={`heatmap-rect ${c.trained ? "active" : ""}`}
          fill={c.trained ? "#38bdf8" : "#1f2937"}
        >
          <title>{c.key}</title>
        </rect>
      ))}

      {monthLabels.map((m) => (
        <text
          key={m.label}
          x={m.x}
          y={svgHeight + 18}
          fontSize="12.5"
          fontWeight="500"
          fill="#9a9c9e"
          style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
        >
          {m.label}
        </text>
      ))}
    </svg>
  );
};

export default YearHeatmapSVG;