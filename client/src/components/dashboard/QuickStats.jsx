import { muscleMeta } from "./heatmapConfig";

export default function QuickStats({ muscle, stats, range }) {
  const label = muscle ? muscleMeta[muscle]?.label.toUpperCase() : "—";

  const volume =
    stats && typeof stats.totalVolume === "number"
      ? `${stats.totalVolume.toLocaleString()} kg`
      : "—";

  const sets = typeof stats?.totalSets === "number" ? stats.totalSets : "—";

  const reps = typeof stats?.totalReps === "number" ? stats.totalReps : "—";

  const lastTrained = stats?.lastTrained
    ? new Date(stats.lastTrained).toLocaleDateString()
    : "—";

  return (
    <div className="quickstats-root" style={{ opacity: muscle ? 1 : 0.55 }}>
      {/* LEFT SIDE */}
      <div className="qs-left">
        <div className="qs-muscle">{label}</div>
        <div className="qs-divider" />

        <div className="qs-volume">{volume}</div>
        <div className="qs-sub">
          Volume ({range === "month" ? "30d" : "7d"})
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="qs-right">
        <div className="qs-sr-grid">
          <div className="qs-sr">
            <div className="qs-sr-value">{sets}</div>
            <div className="qs-sr-label">SETS</div>
          </div>

          <div className="qs-sr">
            <div className="qs-sr-value">{reps}</div>
            <div className="qs-sr-label">REPS</div>
          </div>
        </div>

        <div className="qs-meta muted">Last trained: {lastTrained}</div>
      </div>
    </div>
  );
}
