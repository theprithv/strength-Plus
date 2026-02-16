import React, { useState, useEffect } from "react";
import "../styles/History.css";
import HistoryMainArea from "../components/HistoryMainArea";
import HistoryRightPanel from "../components/HistoryRightPanel";
import { getWorkoutsByDate, getAllWorkouts } from "../../../services/historyApi";

const History = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workouts, setWorkouts] = useState([]);
  const [allWorkouts, setAllWorkouts] = useState([]); // For calendar dots
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch full history ONLY ONCE on mount for calendar indicators
  useEffect(() => {
    getAllWorkouts()
      .then(setAllWorkouts)
      .catch(err => console.error("Failed to fetch calendar indicators:", err));
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
      setError(null);
      try {
        setLoading(true);
        const data = await getWorkoutsByDate(selectedDate);
        setWorkouts(data);
      } catch (err) {
        console.error("Failed to load history:", err);
        setError("Failed to load workouts for this date");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [selectedDate]);

  return (
    <div className="history-page-container">
      <div className="history-main-area">
        {error && (
          <p style={{ padding: "1rem 2rem", color: "#ef4444" }}>{error}</p>
        )}
        <HistoryMainArea
          selectedDate={selectedDate}
          workouts={workouts}
          loading={loading}
        />
      </div>

      <div className="history-right-panel">
        <HistoryRightPanel
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          workouts={workouts}
          allWorkouts={allWorkouts}
        />
      </div>
    </div>
  );
};

export default History;
