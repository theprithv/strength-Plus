import { useEffect, useState } from "react";
import api from "../services/api";

export default function Workout() {
  const [exercises, setExercises] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/exercises")
      .then((res) => setExercises(res.data || []))
      .catch((err) => setError(err.response?.data?.error || "Failed to load exercises"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Workout Session</h1>
      <h3>Select Exercises</h3>
      {error && <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>}
      {loading && <p style={{ color: "#9ca3af" }}>Loading exercises…</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {exercises.map((ex) => (
          <div
            key={ex.id}
            onClick={() => {
              if (!selected.find((e) => e.id === ex.id)) {
                setSelected([...selected, ex]);
              }
            }}
            style={{
              padding: "1rem",
              border: "1px solid #333",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            {ex.name}
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: "2rem" }}>Current Workout</h3>

      {selected.map((ex) => (
        <div key={ex.id} style={{ marginBottom: "1rem" }}>
          <strong>{ex.name}</strong>
        </div>
      ))}
    </div>
  );
}
