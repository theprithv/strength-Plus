import React, { useState, useEffect } from "react";
import { getExercises } from "../../services/exerciseApi";

export default function ExerciseSelectModal({ isOpen, onClose, onSelect }) {
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      getExercises().then((res) => setExercises(res || []));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      {/* stopPropagation prevents clicking the modal itself from closing it */}
      <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <h3>Select Exercise</h3>
          <button onClick={onClose} className="modal-close-btn">×</button>
        </div>

        <input
          type="text"
          placeholder="Search exercises..."
          className="profile-exercise-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />

        <div className="profile-exercise-list">
          {filtered.length > 0 ? (
            filtered.map((ex) => (
              <div
                key={ex.id}
                className="profile-exercise-item"
                onClick={() => onSelect(ex.id)}
              >
                <span>{ex.name}</span>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", color: "#6b7280", padding: "20px" }}>
              No exercises found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}