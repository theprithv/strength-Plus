import { useEffect, useState } from "react";
import api from "../../../services/api";
import Dropdown from "../../../components/layout/Dropdown";
import "../styles/Exercises.css";
import AddExerciseModal from "./AddExerciseModal";

const MUSCLES = [
  "abdominals",
  "shoulders",
  "biceps",
  "triceps",
  "forearms",
  "quadriceps",
  "hamstrings",
  "calves",
  "glutes",
  "abductors",
  "adductors",
  "lats",
  "upperback",
  "traps",
  "lowerback",
  "chest",
  "cardio",
  "neck",
  "fullbody",
  "others",
];

const EQUIPMENT = [
  "none",
  "barbell",
  "dumbbell",
  "kettlebell",
  "machine",
  "plate",
  "resistance band",
  "suspension",
  "others",
];

export default function ExerciseLibraryContent({
  pickerMode = false,
  onSelectExercise,
}) {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [search, setSearch] = useState("");
  const [muscle, setMuscle] = useState("all");
  const [equipment, setEquipment] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      const res = await api.get("/exercises");
      setExercises(res.data);
      if (res.data.length > 0) setSelectedExercise(res.data[0]);
    };
    fetchExercises();
  }, []);

  const normalize = (value = "") =>
    value.toString().toLowerCase().replace(/\s+/g, "");

  const filteredExercises = exercises.filter((ex) => {
    const name = normalize(ex.name);
    const exMuscle = normalize(ex.primaryMuscle);
    const exEquipment = normalize(ex.equipment);

    return (
      name.includes(normalize(search)) &&
      (muscle === "all" || exMuscle === normalize(muscle)) &&
      (equipment === "all" || exEquipment === normalize(equipment))
    );
  });

  return (
    <>
      {!pickerMode && (
        <div className="library-header">
          <h2>Library</h2>
          <button className="add-custom-btn" onClick={() => setShowModal(true)}>
            + Custom Exercise
          </button>
        </div>
      )}

      <input
        className="library-search"
        placeholder="Search exercises..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="library-filters">
        <Dropdown
          value={muscle === "all" ? "All Muscles" : muscle}
          options={["All Muscles", ...MUSCLES]}
          onChange={(v) => setMuscle(v === "All Muscles" ? "all" : v)}
        />
        <Dropdown
          value={equipment === "all" ? "All Equipment" : equipment}
          options={["All Equipment", ...EQUIPMENT]}
          onChange={(v) => setEquipment(v === "All Equipment" ? "all" : v)}
        />
      </div>

      <div className="library-list">
        <p style={{ color: "#888" }}>
          Total: {filteredExercises.length} exercises
        </p>

        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            className={`exercise-card ${
              selectedExercise?.id === ex.id ? "active" : ""
            }`}
            onClick={() => {
              setSelectedExercise(ex);

              // If parent passed a callback, always notify it
              if (onSelectExercise) {
                onSelectExercise(ex);
              }
            }}
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
                        setEditTarget(ex);
                        setShowModal(true);
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
                      onClick={async (e) => {
                        e.stopPropagation();

                        if (!window.confirm("Delete this exercise?")) return;

                        try {
                          await api.delete(`/exercises/${ex.id}`);

                          const res = await api.get("/exercises");
                          setExercises(res.data);
                          setSelectedExercise(null);
                        } catch (err) {
                          alert("Cannot delete exercise in use");
                        }
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
        ))}
      </div>
      {showModal && (
        <AddExerciseModal
          editExercise={editTarget}
          onClose={() => {
            setShowModal(false);
            setEditTarget(null);
          }}
          onAdd={async () => {
            const res = await api.get("/exercises");
            setExercises(res.data);
          }}
        />
      )}
    </>
  );
}
