import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import "../assets/styles/Routines.css";

import ExerciseLibrary from "../components/exercises/ExerciseLibrary";
import ExerciseLibraryContent from "../components/exercises/ExerciseLibraryContent";

export default function Routines() {
  const [routines, setRoutines] = useState([]);
  const [activeRoutine, setActiveRoutine] = useState(null);
  const [routineExercises, setRoutineExercises] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");
  const [routinesError, setRoutinesError] = useState(null);
  const editRef = useRef(null);
  const activeRequest = useRef(null);

  useEffect(() => {
    loadRoutines();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (!editingId) return;
      if (!editRef.current) return;
      if (editRef.current.contains(e.target)) return;
      setTimeout(() => {
        setEditingId(null);
        setEditName("");
      }, 150);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingId]);

  async function loadRoutines() {
    setRoutinesError(null);
    try {
      const res = await api.get("/routines");
      setRoutines(res.data || []);
      const current = (res.data || []).find((r) => r.isCurrent) || res.data?.[0];
      if (current) {
        setActiveRoutine(current);
        loadRoutineExercises(current.id);
      }
    } catch (err) {
      console.error("Failed to load routines", err);
      setRoutinesError("Failed to load routines");
    }
  }

  function handleDrop(targetIndex) {
    if (dragIndex === null || dragIndex === targetIndex) return;

    setRoutineExercises((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(targetIndex, 0, moved);

      saveOrder(updated);
      return updated;
    });

    setDragIndex(null);
  }

  async function loadRoutineExercises(routineId) {
    setLoadingExercises(true);

    const requestId = routineId;
    activeRequest.current = requestId;

    try {
      const res = await api.get(`/routines/${routineId}/exercises`);

      if (activeRequest.current !== requestId) return;

      setRoutineExercises(res.data);
    } catch (err) {
      console.error("Failed to load routine exercises", err);
      setRoutineExercises([]);
    } finally {
      if (activeRequest.current === requestId) {
        setLoadingExercises(false);
      }
    }
  }

  async function saveOrder(updated) {
    try {
      await api.patch(`/routines/${activeRoutine.id}/reorder`, {
        exercises: updated.map((e, i) => ({ id: e.id, order: i + 1 })),
      });
    } catch (err) {
      console.error("Failed to save order", err);
      alert("Failed to save order. Try again.");
    }
  }

  async function renameRoutine(id) {
    const routineId = id; // freeze it

    if (!editName.trim() || !routineId) return;

    try {
      const res = await api.patch(`/routines/${routineId}`, { name: editName });

      setRoutines((prev) =>
        prev.map((r) => (r.id === routineId ? res.data : r))
      );

      if (activeRoutine?.id === routineId) {
        setActiveRoutine(res.data);
      }

      setEditingId(null);
      setEditName("");
    } catch (err) {
      console.error("Rename failed", err);
      alert(err.response?.data?.message || "Failed to rename");
    }
  }

  async function deleteRoutine(id) {
    if (!confirm("Delete this routine?")) return;

    try {
      await api.delete(`/routines/${id}`);
      setRoutines((prev) => prev.filter((r) => r.id !== id));

      if (activeRoutine?.id === id) {
        setActiveRoutine(null);
        setRoutineExercises([]);
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert(err.response?.data?.message || "Failed to delete routine");
    }
  }

  async function duplicateRoutine(routine) {
    try {
      const res = await api.post("/routines", {
        name: routine.name + " Copy",
      });

      const newRoutine = res.data;

      // copy exercises
      for (const ex of routineExercises) {
        await api.post(`/routines/${newRoutine.id}/exercises`, {
          exerciseId: ex.exerciseId,
        });
      }

      setRoutines((prev) => [...prev, newRoutine]);
    } catch (err) {
      console.error("Duplicate failed", err);
      alert(err.response?.data?.message || "Failed to duplicate routine");
    }
  }

  async function createRoutine() {
    if (!newRoutineName.trim()) return;

    try {
      const res = await api.post("/routines", { name: newRoutineName });

      setRoutines((prev) => [...prev, res.data]);
      setActiveRoutine(res.data);
      loadRoutineExercises(res.data.id);
      setRoutineExercises([]);
      setNewRoutineName("");

      // Close & immediately reopen create input for next routine
      setCreating(false);
    } catch (err) {
      console.error("Failed to create routine", err);
      alert(err.response?.data?.message || "Failed to create routine");
    }
  }

  async function removeExercise(routineExerciseId) {
    try {
      await api.delete(`/routines/exercises/${routineExerciseId}`);

      setRoutineExercises((prev) =>
        prev.filter((e) => e.id !== routineExerciseId)
      );
    } catch (err) {
      console.error("Failed to remove exercise", err);
      alert(err.response?.data?.message || "Failed to remove exercise");
    }
  }

  async function setCurrentRoutine(id) {
    try {
      await api.patch(`/routines/${id}/set-current`);

      setRoutines((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, isCurrent: true } : { ...r, isCurrent: false }
        )
      );

      setActiveRoutine((prev) => (prev ? { ...prev, isCurrent: true } : prev));
    } catch (err) {
      console.error("Failed to set current routine", err);
      alert(err.response?.data?.message || "Failed to set current routine");
    }
  }

  return (
    <div className="exercises-page">
      {routinesError && (
        <p style={{ padding: "1rem 2rem", color: "#ef4444" }}>{routinesError}</p>
      )}
      {/* LEFT + CENTER */}
      <div className="routine-workspace">
        <aside className="routines-list">
          <h3 className="routines-title">My Routines</h3>
          <div className="routine-items">
            {routines.map((r) => (
              <div
                key={r.id}
                className={`routine-item ${
                  activeRoutine?.id === r.id ? "active" : ""
                }`}
              >
                {/* your existing routine-row JSX */}
                <div className="routine-row">
                  {editingId === r.id ? (
                    <input
                      ref={editRef}
                      className="rename-input"
                      value={editName}
                      autoFocus
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.stopPropagation();
                          renameRoutine(r.id);
                        }

                        if (e.key === "Escape") {
                          setEditingId(null);
                          setEditName("");
                        }
                      }}
                    />
                  ) : (
                    <span
                      onClick={() => {
                        if (activeRoutine?.id === r.id) return;
                        setRoutineExercises([]);
                        setActiveRoutine(r);
                        loadRoutineExercises(r.id);
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingId(r.id);
                        setEditName(r.name);
                      }}
                    >
                      {r.name}
                    </span>
                  )}

                  <div className="routine-actions">
                    <button
                      onClick={() => duplicateRoutine(r)}
                      className="icon-btn"
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => deleteRoutine(r.id)}
                      className="icon-btn danger"
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M6 7h12l-1 14H7L6 7zm3-4h6l1 2H8l1-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* 👇 always after last split */}
            <div className="create-split-zone">
              {creating ? (
                <input
                  className="create-split-input"
                  placeholder="New split name..."
                  value={newRoutineName}
                  autoFocus
                  onChange={(e) => setNewRoutineName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      createRoutine();
                    }

                    if (e.key === "Escape") {
                      setCreating(false);
                      setNewRoutineName("");
                    }
                  }}
                />
              ) : (
                <button
                  className="new-routine-btn"
                  onClick={() => setCreating(true)}
                >
                  + New Split
                </button>
              )}
            </div>
          </div>
        </aside>

        <section className="routine-editor">
          {activeRoutine ? (
            <>
              <div className="routine-editor-header">
                <h2>{activeRoutine.name}</h2>

                <button
                  className={`set-current-btn ${
                    activeRoutine.isCurrent ? "active" : ""
                  }`}
                  onClick={() => setCurrentRoutine(activeRoutine.id)}
                  disabled={activeRoutine.isCurrent}
                >
                  {activeRoutine.isCurrent ? "Current Split" : "Set as Current"}
                </button>
              </div>

              {routineExercises.length === 0 ? (
                <div className="routine-empty">
                  Select an exercise from the right panel to begin building this
                  routine.
                </div>
              ) : (
                <div className="routine-exercise-list">
                  {routineExercises.map((ex, i) => (
                    <div
                      key={ex.id}
                      className="routine-exercise-card"
                      draggable
                      onDragStart={() => setDragIndex(i)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(i)}
                    >
                      <span className="drag-handle">☰</span>

                      <span className="routine-exercise-name">{ex.name}</span>

                      <button
                        className="remove-exercise-btn"
                        onClick={() => removeExercise(ex.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="routine-empty">Select a routine</div>
          )}
        </section>
      </div>

      <div className="exercise-library">
        <ExerciseLibraryContent
          pickerMode
          onSelectExercise={async (exercise) => {
            if (!activeRoutine) return;

            const exists = routineExercises.some(
              (e) => e.exerciseId === exercise.id
            );
            if (exists) return;

            try {
              const res = await api.post(
                `/routines/${activeRoutine.id}/exercises`,
                { exerciseId: exercise.id }
              );

              setRoutineExercises((prev) => [
                ...prev,
                {
                  id: res.data.id, // routineExercise id
                  exerciseId: exercise.id, // real exercise id
                  name: exercise.name,
                  order: res.data.order,
                },
              ]);
            } catch (err) {
              console.error("Failed to add exercise", err);
              alert(err.response?.data?.message || "Failed to add exercise to routine");
            }
          }}
        />
      </div>
    </div>
  );
}
