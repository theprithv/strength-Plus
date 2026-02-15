import React from "react";
import ExerciseLibraryContent from "../exercises/ExerciseLibraryContent";
import "../../assets/styles/Profile.css";

export default function WorkoutExerciseModal({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div 
        className="profile-modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="profile-modal-header">
          <h3>Select Exercise</h3>
          <button onClick={onClose} className="modal-close-btn">×</button>
        </div>

        <div className="workout-modal-library-wrapper">
          <ExerciseLibraryContent 
            pickerMode 
            onSelectExercise={(ex) => {
              onSelect(ex);
              onClose();
            }} 
          />
        </div>
      </div>
    </div>
  );
}
