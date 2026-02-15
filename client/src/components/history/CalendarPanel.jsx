import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";      // default styles FIRST
import "../../assets/styles/Calendar.css";      // your overrides LAST


const CalendarPanel = ({ selectedDate, setSelectedDate, workouts = [] }) => {

  const hasWorkoutOnDate = (date) => {
    return workouts.some((w) => {
      const workoutDate = new Date(w.startTime);

      return (
        workoutDate.getDate() === date.getDate() &&
        workoutDate.getMonth() === date.getMonth() &&
        workoutDate.getFullYear() === date.getFullYear()
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
          tileClassName={({ date, view }) => {
            if (view === "month" && hasWorkoutOnDate(date)) {
              return "has-workout";
            }
          }}
        />
      </div>
    </div>
  );
};

export default CalendarPanel;
