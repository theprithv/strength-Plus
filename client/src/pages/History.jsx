import React, { useState, useEffect } from "react";
import "../assets/styles/History.css";

import HistoryMainArea from "../components/history/HistoryMainArea";
import HistoryRightPanel from "../components/history/HistoryRightPanel";
import { getWorkoutsByDate } from "../services/historyApi";

const History = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        />
      </div>
    </div>
  );
};

export default History;
