import YearHeatmapCell from "./YearHeatmapCell";

const CELL_SIZE = 11;
const GAP = 3;
const MONTH_GAP = 10;

const YearHeatmapGrid = ({ year, trainedDays }) => {
  const trainedSet = new Set(trainedDays);

  const months = [];

  for (let m = 0; m < 12; m++) {
    const firstDay = new Date(year, m, 1);
    const lastDay = new Date(year, m + 1, 0);
    const daysInMonth = lastDay.getDate();

    const startOffset = firstDay.getDay(); // Sun = 0
    const totalCells = startOffset + daysInMonth;
    const weeks = Math.ceil(totalCells / 7);

    const grid = Array.from({ length: weeks }, () =>
      Array(7).fill(null)
    );

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, m, d);
      const weekIndex = Math.floor((startOffset + d - 1) / 7);
      const dayIndex = date.getDay();

      const iso = `${year}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

      grid[weekIndex][dayIndex] = {
        iso,
        trained: trainedSet.has(iso),
      };
    }

    months.push({
      month: m,
      weeks,
      grid,
    });
  }

  let currentLeft = 0;
  const monthLabelPositions = [];

  months.forEach((m) => {
    const width =
      m.weeks * (CELL_SIZE + GAP) - GAP;
    const center = currentLeft + width / 2;

    monthLabelPositions.push({
      month: m.month,
      left: center,
    });

    currentLeft += width + MONTH_GAP;
  });

  return (
    <div className="year-heatmap-wrapper">
      <div className="year-heatmap">
        {months.map((m, mi) => (
          <div key={mi} className="month-block">
            {m.grid.map((week, wi) => (
              <div key={wi} className="heatmap-week">
                {week.map((day, di) => (
                  <YearHeatmapCell
                    key={di}
                    date={day?.iso}
                    trained={day?.trained}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="month-label-row">
        {monthLabelPositions.map(({ month, left }) => (
          <span
            key={month}
            className="month-label"
            style={{ left }}
          >
            {new Date(year, month).toLocaleString("en", {
              month: "short",
            })}
          </span>
        ))}
      </div>
    </div>
  );
};

export default YearHeatmapGrid;
