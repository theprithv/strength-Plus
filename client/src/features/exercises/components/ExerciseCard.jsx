import React, { memo } from "react";
import api from "../../../services/api";

const ExerciseCard = memo(({ ex, isSelected, pickerMode, onSelect, onEdit, onDelete }) => {
  return (
    <div
      className={`exercise-card ${isSelected ? "active" : ""}`}
      onClick={() => onSelect(ex)}
    >
      <div className="exercise-thumb">
        {ex.isCustom && <img src="/assets/images/s+.png" alt="Strength+" />}
      </div>
      <div className="exercise-meta">
        <div className="exercise-name">
          {ex.name}

          {!pickerMode && ex.isCustom && (
            <span className="exercise-actions">
              <button
                className="exercise-action-btn edit"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(ex);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </button>

              <button
                className="exercise-action-btn delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(ex);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 7h12l-1 14H7L6 7zm3-4h6l1 2H8l1-2z"></path>
                </svg>
              </button>
            </span>
          )}
        </div>

        <div className="exercise-muscle">{ex.primaryMuscle}</div>
      </div>
    </div>
  );
});

export default ExerciseCard;
