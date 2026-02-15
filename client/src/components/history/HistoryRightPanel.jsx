import React from "react";
import CalendarPanel from "./CalendarPanel";
import DaySummaryPanel from "./DaySummaryPanel";

const HistoryRightPanel = ({ selectedDate, setSelectedDate, workouts }) => {
  return (
    <div className="history-right-wrapper">
      <div className="history-calendar-container">
        <CalendarPanel
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          workouts={workouts}
        />
      </div>

      <div className="history-summary-container">
        <DaySummaryPanel selectedDate={selectedDate} workouts={workouts} />
      </div>
    </div>
  );
};

export default HistoryRightPanel;
