import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";      // default styles FIRST
import "../styles/Calendar.css";      // your overrides LAST


const CalendarPanel = ({ selectedDate, setSelectedDate, workouts = [] }) => {

  const hasWorkoutOnDate = (date) => {
    return workouts.some((w) => {
      // Prefer the explicit `date` field; fall back to startTime
      const raw = w.date ?? w.startTime;
      // Parse as UTC date string to avoid timezone shifting
      const workoutDate = new Date(raw);

      return (
        workoutDate.getUTCDate() === date.getDate() &&
        workoutDate.getUTCMonth() === date.getMonth() &&
        workoutDate.getUTCFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <div className="calendar-box">
      <div className="panel-header">
        <h3>Calendar</h3>
      </div>

      <div className="calendar-body">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={({ date, view }) => {
            if (view === "month" && hasWorkoutOnDate(date)) {
              return <div className="tile-workout-dot" />;
            }
            return null;
          }}
        />
      </div>
    </div>
  );
};

export default CalendarPanel;
