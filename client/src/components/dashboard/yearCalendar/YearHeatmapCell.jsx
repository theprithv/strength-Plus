const YearHeatmapCell = ({ date, trained }) => {
  if (!date) return <div className="heatmap-cell empty" />;

  return (
    <div
      className={`heatmap-cell ${trained ? "active" : ""}`}
      title={`${date} — ${trained ? "Trained" : "No workout"}`}
    />
  );
};

export default YearHeatmapCell;
