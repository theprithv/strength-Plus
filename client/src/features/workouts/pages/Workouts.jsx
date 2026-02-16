import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import ExerciseLibraryContent from "../../exercises/components/ExerciseLibraryContent";
import WorkoutExerciseModal from "../components/WorkoutExerciseModal";
import api from "../../../services/api";
import "../styles/Workout.css";

export default function Workouts() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  // 🧠 Session control
  const { 
    isWorkoutActive, 
    setIsWorkoutActive, 
    activeWorkoutId, 
    setActiveWorkoutId, 
    workoutStartTime: startTime, 
    setWorkoutStartTime: setStartTime 
  } = useContext(AuthContext);

  const [activeRoutineId, setActiveRoutineId] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // 🏋️ Workout data
  const [exercises, setExercises] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [swappingExerciseId, setSwappingExerciseId] = useState(null);
  const [editingSetId, setEditingSetId] = useState(null);
  const [editWeight, setEditWeight] = useState("");
  const [editReps, setEditReps] = useState("");

  // 📊 Live stats
  const [totalSets, setTotalSets] = useState(0);
  const [totalReps, setTotalReps] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);

  // 🧭 Current split (later this will come from Routines)
  const [currentSplit, setCurrentSplit] = useState(null);

  // 🧠 Load current routine on mount
  useEffect(() => {
    async function loadCurrentRoutine() {
      try {
        const res = await api.get("/routines/current");

        if (res.data) {
          setCurrentSplit(res.data.name);
          setActiveRoutineId(res.data.id);

          const injected = res.data.exercises.map((re) => ({
            id: re.id,
            exerciseId: re.exerciseId,
            name: re.exercise.name,
            sets: re.sets.map((s) => ({
              id: s.id,
              reps: s.reps,
              weight: s.weight,
            })),
          }));

          setExercises(injected);
        }
      } catch (err) {
        console.error("Failed to load current routine", err);
      }
    }

    loadCurrentRoutine();
  }, []);

  // 🔄 Check window size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🔄 Load exercises if workout is active
  useEffect(() => {
    if (isWorkoutActive && activeWorkoutId) {
      async function loadActiveExercises() {
        try {
          const res = await api.get("/workouts/active");
          if (!res.data) return;
          
          const restored = res.data.exercises.map((ex) => ({
            id: ex.id,
            name: ex.exercise.name,
            sets: ex.sets.map((s) => ({
              id: s.id,
              weight: s.weight,
              reps: s.reps,
            })),
          }));
          setExercises(restored);
        } catch (err) {
          console.error("Failed to load active exercises:", err);
        }
      }
      loadActiveExercises();
    }
  }, [isWorkoutActive, activeWorkoutId]);

  // 🖱 Close menus on click outside
  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  // 🕒 Timer engine
  useEffect(() => {
    if (!startTime) return;

    const update = () => {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(seconds);
    };

    update();
    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // 📊 Auto-calculate stats from exercises
  useEffect(() => {
    let sets = 0;
    let reps = 0;
    let volume = 0;

    exercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        sets++;
        reps += Number(set.reps);
        volume += Number(set.reps) * Number(set.weight);
      });
    });

    setTotalSets(sets);
    setTotalReps(reps);
    setTotalVolume(volume);
  }, [exercises]);

  // ▶️ Start workout
  async function startWorkout() {
    if (isWorkoutActive) {
      alert("You already have an active workout.");
      return;
    }

    try {
      const res = await api.post("/workouts/start", {
        splitName: currentSplit,
      });

      const workout = res.data;

      setActiveWorkoutId(workout.id);
      setIsWorkoutActive(true);
      setStartTime(Date.now());

      // 🧠 NEW: Load routine-powered workout into UI
      const hydratedExercises = workout.exercises.map((ex) => ({
        id: ex.id,
        exerciseId: ex.exerciseId,
        name: ex.exercise.name,
        sets: ex.sets.map((set) => ({
          id: set.id,
          reps: set.reps,
          weight: set.weight,
        })),
      }));

      setExercises(hydratedExercises);

      // Recalculate stats from backend data
      let sets = 0,
        reps = 0,
        volume = 0;

      hydratedExercises.forEach((ex) => {
        ex.sets.forEach((set) => {
          sets++;
          reps += set.reps;
          volume += set.reps * set.weight;
        });
      });

      setTotalSets(sets);
      setTotalReps(reps);
      setTotalVolume(volume);
    } catch (err) {
      console.error("Failed to start workout:", err);
      alert(err.response?.data?.error || "Failed to start workout");
    }
  }

  async function addExercise(exercise) {
    if (!activeWorkoutId) {
      alert("Start the workout first");
      return false;
    }

    try {
      const res = await api.post(`/workouts/${activeWorkoutId}/exercises`, {
        exerciseId: exercise.id,
      });

      const newWorkoutExercise = {
        id: res.data.id,
        name: exercise.name,
        sets: [],
      };

      setExercises((prev) => [...prev, newWorkoutExercise]);
      return true;
    } catch (err) {
      console.error("Failed to add exercise:", err);
      alert(err.response?.data?.error || "Failed to add exercise");
      return false;
    }
  }

  async function addSet(workoutExerciseId, weight, reps) {
    // 🔒 NEW GUARD – stop user if workout not started
    if (!isWorkoutActive) {
      alert("Please start the workout first");
      return;
    }

    try {
      const res = await api.post(
        `/workouts/exercises/${workoutExerciseId}/sets`,
        {
          weight: Number(weight),
          reps: Number(reps),
        }
      );

      const savedSet = res.data;

      const updatedExercises = exercises.map((ex) => {
        if (ex.id === workoutExerciseId) {
          return {
            ...ex,
            sets: [
              ...ex.sets,
              {
                id: savedSet.id,
                weight: savedSet.weight,
                reps: savedSet.reps,
              },
            ],
          };
        }
        return ex;
      });

      setExercises(updatedExercises);
    } catch (err) {
      console.error("Add set failed:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to add set");
    }
  }

  async function removeSet(workoutExerciseId, setId) {
    if (!window.confirm("Remove this set?")) return;
    try {
      await api.delete(`/workouts/sets/${setId}`);
      setExercises(prev => prev.map(ex => {
        if (ex.id === workoutExerciseId) {
          return { ...ex, sets: ex.sets.filter(s => s.id !== setId) };
        }
        return ex;
      }));
    } catch (err) {
      console.error("Delete set error:", err);
    }
  }

  function startEditSet(setId, weight, reps) {
    setEditingSetId(setId);
    setEditWeight(weight);
    setEditReps(reps);
  }

  async function saveInlineEdit(workoutExerciseId, setId) {
    try {
      const res = await api.patch(`/workouts/sets/${setId}`, {
        weight: Number(editWeight),
        reps: Number(editReps)
      });
      
      const updatedSet = res.data;
      setExercises(prev => prev.map(ex => {
        if (ex.id === workoutExerciseId) {
          return {
            ...ex,
            sets: ex.sets.map(s => s.id === setId ? { ...s, weight: updatedSet.weight, reps: updatedSet.reps } : s)
          };
        }
        return ex;
      }));
      setEditingSetId(null);
    } catch (err) {
      console.error("Update set error:", err);
      alert("Failed to update set");
    }
  }

  function cancelEdit() {
    setEditingSetId(null);
    setEditWeight("");
    setEditReps("");
  }

  async function removeExercise(exerciseObjId) {
    if (!window.confirm("Remove this exercise and all its sets?")) return;
    
    const exerciseToRemove = exercises.find(ex => ex.id === exerciseObjId);
    if (!exerciseToRemove) return;

    try {
      if (!isWorkoutActive) {
        // In Preview Mode, ID is the RoutineExercise.id
        await api.delete(`/routines/exercises/${exerciseObjId}`);
      } else {
        // In Active Workout, ID is the WorkoutExercise.id
        await api.delete(`/workouts/exercises/${exerciseObjId}`);
        
        // Also remove from routine as requested
        if (activeRoutineId && exerciseToRemove.exerciseId) {
          await api.delete(`/routines/${activeRoutineId}/exercises/by-exercise/${exerciseToRemove.exerciseId}`);
        }
      }

      setExercises(prev => prev.filter(ex => ex.id !== exerciseObjId));
      setOpenMenuId(null);
    } catch (err) {
      console.error("Failed to remove exercise:", err);
      alert("Failed to remove exercise");
    }
  }

  function handleEditClick(id) {
    setSwappingExerciseId(id);
    setOpenMenuId(null);
    setModalOpen(true);
  }

  async function swapExercise(newExercise) {
    if (!swappingExerciseId) return;

    try {
      const res = await api.patch(`/workouts/exercises/${swappingExerciseId}`, {
        exerciseId: newExercise.id,
      });

      const updated = res.data;
      setExercises(prev => prev.map(ex => {
        if (ex.id === swappingExerciseId) {
          return {
            ...ex,
            name: updated.exercise.name,
          };
        }
        return ex;
      }));

      setSwappingExerciseId(null);
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to swap exercise:", err);
      alert("Failed to swap exercise");
    }
  }

  function formatTime(seconds) {
    if (seconds < 60) {
      return `${seconds}s`;
    }

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(
        2,
        "0"
      )}`;
    }

    return `${mins}:${String(secs).padStart(2, "0")}`;
  }

  async function finishWorkout() {
    if (!activeWorkoutId) return;

    try {
      await api.post(`/workouts/${activeWorkoutId}/finish`, {
        notes: "Completed from UI",
      });

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      setIsWorkoutActive(false);
      setActiveWorkoutId(null);
      setStartTime(null);
      setElapsedTime(0);
      setExercises([]);
    } catch (err) {
      console.error("Failed to finish workout:", err);
      alert(err.response?.data?.error || "Failed to finish workout");
    }
  }

  return (
    <div className="workout-page">
      <div className="workout-layout">
        <div className="workout-container">
          <>
              {/* HEADER ZONE */}
              <header className="workout-header-zone">
                <div className="header-top-flex">
                  <div>
                    <h2 style={{ fontSize: '26px', fontWeight: '640', color: '#fff'}}>
                      {isWorkoutActive ? "Active Workout" : "Start training Today"}
                    </h2>
                    <p style={{ color: 'var(--workout-text-dim)', fontSize: '14px', marginTop: '-20px' }}>
                      Split: <strong style={{ color: '#38bdf8', fontWeight: '400' }}>{currentSplit || "Custom"}</strong>
                    </p>
                  </div>

                  <div className="session-toggle-area">
                     {!isWorkoutActive ? (
                       <button className="start-workout-btn" onClick={startWorkout}>
                         Start Session
                       </button>
                     ) : (
                       <div style={{ display: 'flex', gap: '12px' }}>
                          <button className="start-workout-btn active">Session In Progress</button>
                       </div>
                     )}
                  </div>
                </div>

                <div className="workout-stats-grid">
                  <div className="stat-v-card">
                    <span className="stat-v-label">Duration</span>
                    <span className={`stat-v-value ${isWorkoutActive ? 'stat-active-timer' : ''}`}>
                      {formatTime(elapsedTime)}
                    </span>
                  </div>
                  <div className="stat-v-card">
                    <span className="stat-v-label">Total Sets</span>
                    <span className="stat-v-value">{totalSets}</span>
                  </div>
                  <div className="stat-v-card">
                    <span className="stat-v-label">Reps</span>
                    <span className="stat-v-value">{totalReps}</span>
                  </div>
                  <div className="stat-v-card">
                    <span className="stat-v-label">Volume</span>
                    <span className="stat-v-value">{totalVolume.toLocaleString()} <small style={{ fontSize: '10px' }}>KG</small></span>
                  </div>
                </div>
              </header>

              {/* SESSION ZONE */}
              <main className="workout-session-modern">
                <div className="session-title-row">
                  <h3 className="stack-title">Exercise Stack</h3>
                </div>

                <div className="exercise-stack">
                  {exercises.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed var(--workout-border)' }}>
                       <p style={{ color: 'var(--workout-text-dim)' }}>No exercises added. Add one to get started!</p>
                    </div>
                  ) : (
                    exercises.map((ex) => (
                      <div key={ex.id} className="exercise-modern-card">
                        <div className="exercise-card-header">
                          <h4 className="exercise-title-modern">{ex.name}</h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                             {/* Set badge removed */}
                            
                            <div className="exercise-menu-wrapper" onClick={(e) => e.stopPropagation()}>
                              <button 
                                className="three-dot-btn" 
                                onClick={() => setOpenMenuId(openMenuId === ex.id ? null : ex.id)}
                              >
                                ⋮
                              </button>
                              
                              {openMenuId === ex.id && (
                                <div className="exercise-dropdown-menu">
                                  <button onClick={() => handleEditClick(ex.id)}>
                                    <span className="menu-icon">⇄</span> Swap
                                  </button>
                                  <button className="delete-opt" onClick={() => removeExercise(ex.id)}>
                                    <span className="menu-icon">🗑</span> Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="exercise-card-body">
                          {ex.sets.length > 0 && (
                            <div className="sets-table">
                              <div className="sets-table-header">
                                <span>Set</span>
                                <span>Weight</span>
                                <span>Reps</span>
                                <span style={{ textAlign: 'right' }}>Actions</span>
                              </div>
                              {ex.sets.map((set, i) => (
                                <div key={set.id || i} className={`set-modern-row ${editingSetId === set.id ? 'is-editing' : ''}`}>
                                  <span className="set-index">#{i + 1}</span>
                                  
                                  {editingSetId === set.id ? (
                                    <>
                                      <input 
                                        type="number" 
                                        className="inline-edit-input"
                                        value={editWeight}
                                        onChange={(e) => setEditWeight(e.target.value)}
                                        autoFocus
                                      />
                                      <input 
                                        type="number" 
                                        className="inline-edit-input"
                                        value={editReps}
                                        onChange={(e) => setEditReps(e.target.value)}
                                      />
                                      <div className="set-actions">
                                        <button className="set-action-btn save" onClick={() => saveInlineEdit(ex.id, set.id)} title="Save">✓</button>
                                        <button className="set-action-btn cancel" onClick={cancelEdit} title="Cancel">×</button>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <span className="set-v-text">{set.weight} <small style={{ fontSize: '10px', opacity: 0.6 }}>KG</small></span>
                                      <span className="set-v-text">{set.reps} <small style={{ fontSize: '10px', opacity: 0.6 }}>REPS</small></span>
                                      {isWorkoutActive && (
                                        <div className="set-actions">
                                          <button className="set-action-btn edit" onClick={() => startEditSet(set.id, set.weight, set.reps)} title="Edit Set">✎</button>
                                          <button className="set-action-btn delete" onClick={() => removeSet(ex.id, set.id)} title="Delete Set">×</button>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="add-set-modern-zone">
                            <AddSetInline 
                              isActive={isWorkoutActive}
                              onAdd={(w, r) => addSet(ex.id, w, r)} 
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {isWorkoutActive && (
                  <div className="workout-action-footer">
                    {isMobile && (
                      <button 
                        className="add-exercise-bar"
                        onClick={() => setModalOpen(true)}
                      >
                        <span className="plus-icon">+</span> Add Exercise
                      </button>
                    )}

                    <button className="finish-workout-btn" onClick={finishWorkout}>
                      Finish & Save Workout
                    </button>
                  </div>
                )}
              </main>
            </>

        </div>

        {/* TOAST NOTIFICATION */}
        {showToast && (
          <div className="toast-fixed-container">
            <div className="minimal-success-toast">
              <span className="toast-icon">✔</span>
              <span className="toast-msg">Workout Saved Successfully!</span>
            </div>
          </div>
        )}


        {/* PERMANENT SIDEBAR ON DESKTOP */}
        {!isMobile && (
          <div className="workout-permanent-library">
            <div className="library-column-header">
               <h3>Exercise Library</h3>
            </div>
            <ExerciseLibraryContent
              pickerMode
              onSelectExercise={(exercise) => {
                addExercise(exercise);
              }}
            />
          </div>
        )}

        {/* MOBILE MODAL */}
        <WorkoutExerciseModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSwappingExerciseId(null);
          }}
          onSelect={(exercise) => {
            if (swappingExerciseId) {
              swapExercise(exercise);
            } else {
              addExercise(exercise);
            }
          }}
        />
      </div>
    </div>
  );
}

function AddSetInline({ onAdd, isActive }) {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  function submit() {
    if (!weight || !reps) return;
    onAdd(Number(weight), Number(reps));
    setWeight("");
    setReps("");
    setOpen(false);
  }


  return (
    <div className="modern-set-inputs">
      {open ? (
        <>
          <div className="modern-input-group">
            <input
              className="modern-input-field"
              type="number"
              placeholder="KG"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              autoFocus
            />
          </div>
          <div style={{ color: 'var(--workout-text-dim)', fontWeight: '700' }}>×</div>
          <div className="modern-input-group">
            <input
              className="modern-input-field"
              type="number"
              placeholder="REPS"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
          </div>
          <button className="modern-add-btn" onClick={submit}>
            ✔
          </button>
          <button 
            style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        </>
      ) : (
        <button 
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '12px', 
            background: 'rgba(255,255,255,0.04)', 
            border: '1px dashed var(--workout-border)', 
            color: 'var(--workout-accent)', 
            fontWeight: '500', 
            cursor: 'pointer' 
          }}
          onClick={() => {
            if (!isActive) {
              alert("Please start the workout first");
              return;
            }
            setOpen(true);
          }}
        >
          + Add New Set
        </button>
      )}
    </div>
  );
}
