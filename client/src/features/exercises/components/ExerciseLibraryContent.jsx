import { useEffect, useState, useMemo, useCallback } from "react";
import api from "../../../services/api";
import { useExerciseContext } from "../../../context/ExerciseContext";
import Dropdown from "../../../components/layout/Dropdown";
import "../styles/Exercises.css";
import AddExerciseModal from "./AddExerciseModal";
import ExerciseCard from "./ExerciseCard";

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
  const { exercises, fetchExercises, refreshExercises, loading, hasMore, totalCount } = useExerciseContext();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [search, setSearch] = useState("");
  const [muscle, setMuscle] = useState("all");
  const [equipment, setEquipment] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // Initial load
  useEffect(() => {
    if (exercises.length === 0) {
      refreshExercises(); 
    }
  }, []); 

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchExercises(false); // Load next page
        }
      },
      { threshold: 1.0 }
    );

    const trigger = document.getElementById("scroll-trigger");
    if (trigger) observer.observe(trigger);

    return () => {
      if (trigger) observer.unobserve(trigger);
    };
  }, [hasMore, loading]);

  // Set selected exercise once exercises are loaded
  useEffect(() => {
    // Only auto-select if NOT in picker mode (Workouts page)
    if (!pickerMode && exercises.length > 0 && !selectedExercise) {
      const first = exercises[0];
      setSelectedExercise(first);
      if (onSelectExercise) {
        onSelectExercise(first);
      }
    }
  }, [pickerMode, exercises, selectedExercise, onSelectExercise]);

  // Optimize Filtering with memoization
  const filteredExercises = useMemo(() => {
    const normSearch = search.trim().toLowerCase();
    const normMuscle = muscle === "all" ? null : muscle.toLowerCase();
    const normEquipment = equipment === "all" ? null : equipment.toLowerCase();
    
    // If no filters, return raw list (fast path)
    if (!normSearch && !normMuscle && !normEquipment) {
      return exercises;
    }

    return exercises.filter((ex) => {
      // Inline normalization for speed
      const matchesSearch = !normSearch || ex.name.toLowerCase().includes(normSearch);
      const matchesMuscle = !normMuscle || ex.primaryMuscle.toLowerCase() === normMuscle;
      const matchesEquipment = !normEquipment || ex.equipment.toLowerCase() === normEquipment;

      return matchesSearch && matchesMuscle && matchesEquipment;
    });
  }, [exercises, search, muscle, equipment]);

  // Stable Callbacks for Card Actions
  const handleSelect = useCallback((ex) => {
    setSelectedExercise(ex);
    if (onSelectExercise) {
      onSelectExercise(ex);
    }
  }, [onSelectExercise]);

  const handleEdit = useCallback((ex) => {
    setEditTarget(ex);
    setShowModal(true);
  }, []);

  const handleDelete = useCallback(async (ex) => {
    if (!window.confirm("Delete this exercise?")) return;
    try {
      await api.delete(`/exercises/${ex.id}`);
      refreshExercises();
      setSelectedExercise(null);
    } catch (err) {
      alert("Cannot delete exercise in use");
    }
  }, [refreshExercises]);

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
        <p style={{ color: "#888", marginBottom: "10px" }}>
          Total: {totalCount} exercises
        </p>

        {filteredExercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            ex={ex}
            isSelected={selectedExercise?.id === ex.id}
            pickerMode={pickerMode}
            onSelect={handleSelect}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
        
        {/* Infinite Scroll Trigger */}
        {hasMore && !loading && (
           <div id="scroll-trigger" style={{ height: "20px", margin: "10px 0" }}></div>
        )}
        
        {loading && <p style={{ textAlign: "center", padding: "10px" }}>Loading more...</p>}
      </div>
      
      {showModal && (
        <AddExerciseModal
          editExercise={editTarget}
          onClose={() => {
            setShowModal(false);
            setEditTarget(null);
          }}
          onAdd={async () => {
             refreshExercises();
          }}
        />
      )}
    </>
  );
}
