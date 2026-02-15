import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import searchingAnimation from "../../assets/icons/noResultFound.json";

const HistoryMainArea = ({ selectedDate, workouts, loading }) => {
  // Safe-guard to prevent the toLocaleDateString error
  const formattedDate =
    selectedDate instanceof Date
      ? selectedDate.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  const formatTime = (iso) => {
    if (!iso) return "--:--";
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="history-main-wrapper">
      <div className="history-header">
        <h2>Training History</h2>
        <span className="history-date-label">{formattedDate}</span>
      </div>

      <div className="history-workout-area">
        {loading && (
          <div className="empty-history-state">Loading your progress...</div>
        )}

        {!loading && (!workouts || workouts.length === 0) && (
          <div className="empty-history-container">
            <div className="premium-lottie-wrapper">
              <DotLottieReact data={searchingAnimation} loop autoplay />
              <div className="lottie-bg-glow"></div>
            </div>

            <div className="empty-text-content">
              <h3 className="premium-title">No Workouts Logged</h3>
              <p className="premium-subtitle">
                No training data recorded for this date. Ready to log a session?
              </p>
            </div>

            <button
              className="premium-cta"
              onClick={() => (window.location.href = "/workouts")}
            >
              Start Training
            </button>
          </div>
        )}

        {!loading &&
          workouts &&
          workouts.map((workout) => (
            <div
              key={workout.id || workout._id}
              className="history-workout-card"
            >
              <div className="workout-card-header">
                <div className="workout-title">
                  {workout.splitName || "Workout"}
                </div>

                <div className="workout-time">
                  {formatTime(workout.startTime)} –{" "}
                  {formatTime(workout.endTime)}
                </div>
              </div>

              <div className="workout-stats-bar">
                <span>Sets: {workout.totalSets}</span>
                <span>Reps: {workout.totalReps}</span>
                <span>Volume: {workout.totalVolume} kg</span>
              </div>

              <div className="exercise-list">
                {workout.exercises.map((ex, exIdx) => {
                  const exerciseVolume =
                    ex.sets?.reduce((acc, s) => acc + s.weight * s.reps, 0) ||
                    0;

                  return (
                    <div key={ex.id || exIdx} className="exercise-item">
                      <div className="exercise-header">
                        <div className="exercise-left">
                          {/* Placeholder for future exercise image/icon */}
                          <div className="history-exercise-thumb" />
                          <div>
                            <span className="exercise-name">
                              {ex.exercise?.name || "Exercise"}
                            </span>
                            <div className="exercise-muscle">
                              {ex.exercise?.primaryMuscle}
                            </div>
                          </div>
                        </div>

                        <span className="exercise-volume">
                          Volume: {exerciseVolume} kg
                        </span>
                      </div>

                      <div className="set-table">
                        {ex.sets?.map((set, sIdx) => (
                          <div key={set.id || sIdx} className="set-row">
                            <span className="set-label">
                              Set {set.setNumber || sIdx + 1}
                            </span>
                            <span className="set-value">
                              {set.weight} kg × {set.reps}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HistoryMainArea;
