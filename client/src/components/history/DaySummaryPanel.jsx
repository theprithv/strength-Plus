import React from "react";

const DaySummaryPanel = ({ selectedDate, workouts }) => {
  const formattedDate = selectedDate.toDateString();

  const totalWorkouts = workouts.length;

  let totalSets = 0;
  let totalReps = 0;
  let totalVolume = 0;

  workouts.forEach((workout) => {
    totalSets += workout.totalSets || 0;
    totalReps += workout.totalReps || 0;
    totalVolume += workout.totalVolume || 0;
  });

  return (
    <div className="summary-box">
      <div className="panel-header">
        <h3>Day Summary</h3>
      </div>

      <div className="summary-body">

        <div className="summary-date">
          {formattedDate}
        </div>

        <div className="summary-grid">

          <div className="summary-card">
            <div className="summary-label">Workouts</div>
            <div className="summary-value">{totalWorkouts}</div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Total Sets</div>
            <div className="summary-value">{totalSets}</div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Total Reps</div>
            <div className="summary-value">{totalReps}</div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Total Volume</div>
            <div className="summary-value">{totalVolume}</div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DaySummaryPanel;
