import { useState, useRef, useEffect } from "react";
import BodyHeatmapFront from "./BodyHeatmapFront";
import BodyHeatmapBack from "./BodyHeatmapBack";
import { muscleGroups } from "./heatmapConfig";

const HOVER_COLOR = "#38bdf8";

export default function BodyHeatmap({
  onHoverMuscle,
  onClickMuscle,
  onEmptyClick,
  lockedMuscle,
}) {
  const [view, setView] = useState("front");

  // tracks which muscle is currently hovered
  const currentMuscleRef = useRef(null);

  // root container for scoping DOM queries
  const heatmapRootRef = useRef(null);

  // store original fills so we can restore them
  const originalFillMap = useRef(new Map());

  /* -----------------------------
     APPLY HOVER EFFECT
  ------------------------------ */
  const handleMouseEnter = (e) => {
    // 🔒 If a muscle is locked, ignore all hover effects
    if (lockedMuscle) return;

    const target = e.target.closest?.("[data-muscle]");
    const muscle = target?.getAttribute("data-muscle");

    if (!muscle) return;

    if (currentMuscleRef.current !== target) {
      currentMuscleRef.current = target;
      onHoverMuscle?.(muscle);
    }

    const group = muscleGroups[muscle] ?? [muscle];

    group.forEach((m) => {
      const paths =
        heatmapRootRef.current?.querySelectorAll(
          `[data-muscle="${m}"]`
        ) || [];

      paths.forEach((path) => {
        if (!originalFillMap.current.has(path)) {
          originalFillMap.current.set(path, path.style.fill || "");
        }

        path.style.fill = HOVER_COLOR;
        path.style.filter =
          "drop-shadow(0 0 6px rgba(56,189,248,0.6))";
      });
    });
  };

  /* -----------------------------
     REMOVE HOVER EFFECT
  ------------------------------ */
  const handleMouseLeave = (e) => {
    // 🔒 If a muscle is locked, do NOT remove highlight
    if (lockedMuscle) return;

    const target = e?.target?.closest?.("[data-muscle]");
    const muscle = target?.getAttribute("data-muscle");

    // Leaving SVG entirely
    if (!muscle) {
      currentMuscleRef.current = null;
      onHoverMuscle?.(null);
      return;
    }

    // Ignore movement inside same muscle
    const related = e.relatedTarget;
    if (related && related.closest?.("[data-muscle]") === target) {
      return;
    }

    if (currentMuscleRef.current === target) {
      currentMuscleRef.current = null;
      onHoverMuscle?.(null);
    }

    const group = muscleGroups[muscle] ?? [muscle];

    group.forEach((m) => {
      const paths =
        heatmapRootRef.current?.querySelectorAll(
          `[data-muscle="${m}"]`
        ) || [];

      paths.forEach((path) => {
        const original = originalFillMap.current.get(path);
        path.style.fill = original || "";
        path.style.filter = "";
        originalFillMap.current.delete(path);
      });
    });
  };

  /* -----------------------------
     CLICK HANDLING
  ------------------------------ */
  const handleClick = (e) => {
    const muscleTarget = e.target.closest?.("[data-muscle]");

    // Clicked on muscle → lock / unlock handled by parent
    if (muscleTarget) {
      const muscle = muscleTarget.getAttribute("data-muscle");
      onClickMuscle?.(muscle);
      return;
    }

    // Clicked empty heatmap → unlock
    if (lockedMuscle) {
      onEmptyClick?.();
    }
  };

  /* -----------------------------
     UNLOCK CLEANUP
  ------------------------------ */
  useEffect(() => {
    // 🔓 When lock is released → restore ALL paths
    if (lockedMuscle !== null) return;

    originalFillMap.current.forEach((original, path) => {
      path.style.fill = original || "";
      path.style.filter = "";
    });

    originalFillMap.current.clear();
    currentMuscleRef.current = null;
  }, [lockedMuscle]);

  return (
    <>
      {/* Front / Back Toggle */}
      <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>
        <span
          style={{
            cursor: "pointer",
            color: view === "front" ? "#fff" : "#6b7280",
          }}
          onClick={() => setView("front")}
        >
          Front
        </span>
        {" | "}
        <span
          style={{
            cursor: "pointer",
            color: view === "back" ? "#fff" : "#6b7280",
          }}
          onClick={() => setView("back")}
        >
          Back
        </span>
      </div>

      {/* Heatmap */}
      <div ref={heatmapRootRef}>
        {view === "front" ? (
          <BodyHeatmapFront
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          />
        ) : (
          <BodyHeatmapBack
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          />
        )}
      </div>
    </>
  );
}
