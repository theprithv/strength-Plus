import "../styles/ExerciseLibrary.css";

export default function ExerciseLibrary({
  isOpen = true,
  onClose,
  docked = false,
  children,
}) {
  const panelClass = docked
    ? "exercise-library-panel docked"
    : `exercise-library-panel ${isOpen ? "open" : ""}`;

  return (
    <div className={panelClass}>
      {!docked && (
        <div className="exercise-library-header">
          <button onClick={onClose} className="close-btn">
            ✕
          </button>
        </div>
      )}

      <div className="exercise-library-body">{children}</div>
    </div>
  );
}
