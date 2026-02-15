import { useState, useEffect } from "react";
import api from "../../services/api";
import { MUSCLES, EQUIPMENT } from "../../constants/exerciseOptions.js";

function AddExerciseModal({ onClose, onAdd, editExercise = null }) {
  const [name, setName] = useState("");
  const [primaryMuscle, setPrimaryMuscle] = useState("");
  const [equipment, setEquipment] = useState("");
  const [otherMuscles, setOtherMuscles] = useState([]);
  const [howToSteps, setHowToSteps] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleOther(m) {
    setOtherMuscles((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  }

  useEffect(() => {
    if (editExercise) {
      setName(editExercise.name);
      setPrimaryMuscle(editExercise.primaryMuscle);
      setEquipment(editExercise.equipment);
      setOtherMuscles(editExercise.secondaryMuscles || []);
      setHowToSteps((editExercise.howToSteps || []).join("\n"));
    }
  }, [editExercise]);

  async function handleSubmit() {
    if (!name || !primaryMuscle || !equipment) return;

    const stepsArray = howToSteps
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    setLoading(true);
    try {
      if (editExercise) {
        // EDIT MODE
        const res = await api.put(`/exercises/${editExercise.id}`, {
          name,
          primaryMuscle,
          equipment,
          otherMuscles,
          howToSteps: stepsArray,
        });

        onAdd(res.data);
      } else {
        // CREATE MODE
        const res = await api.post("/exercises", {
          name,
          primaryMuscle,
          equipment,
          otherMuscles,
          howToSteps: stepsArray,
        });

        onAdd(res.data);
      }

      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
    setLoading(false);
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h2>{editExercise ? "Edit Exercise" : "Create Custom Exercise"}</h2>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="modal-body hide-scroll">
          <div className="branding-preview">
            <div className="branding-circle">
              <img src="/assets/images/s+.png" alt="Strength+" className="app-logo-preview" />
            </div>
            <p className="branding-text">Custom exercises are powered by Strength+</p>
          </div>

          <label>Exercise Name</label>
          <input
            placeholder="Enter exercise name..."
            className="strength-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Equipment</label>
          <select
            value={equipment}
            className="strength-input"
            onChange={(e) => setEquipment(e.target.value)}
          >
            <option value="">Select...</option>
            {EQUIPMENT.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>

          <label>Primary Muscle Group</label>
          <select
            value={primaryMuscle}
            className="strength-input"
            onChange={(e) => setPrimaryMuscle(e.target.value)}
          >
            <option value="">Select...</option>
            {MUSCLES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <label>How To / Instructions (One per line)</label>
          <textarea
            placeholder="Step 1: Grip the bar...&#10;Step 2: Lift..."
            className="strength-input instructions-area"
            value={howToSteps}
            onChange={(e) => setHowToSteps(e.target.value)}
            rows={4}
          />

          <label>Other Muscles</label>
          <div className="tag-box">
            {MUSCLES.map((m) => (
              <span
                key={m}
                className={`tag-option ${
                  otherMuscles.includes(m) ? "active" : ""
                }`}
                onClick={() => toggleOther(m)}
              >
                {m}
              </span>
            ))}
          </div>

          <div className="selected-tags">
            {otherMuscles.map((m) => (
              <span key={m} className="tag-pill">
                {m}
                <button onClick={() => toggleOther(m)}>×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="create-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editExercise
              ? "Update Exercise"
              : "Create Exercise"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddExerciseModal;
