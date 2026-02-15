import { useState, useRef, useEffect } from "react";

const YearDropdown = ({ year, availableYears, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="year-dropdown" ref={ref}>
      <button
        className="year-trigger"
        onClick={() => setOpen((o) => !o)}
      >
        {year}
        <span className={`chevron ${open ? "open" : ""}`} />
      </button>

      {open && (
        <div className="year-menu">
          {availableYears.map((y) => (
            <div
              key={y}
              className={`year-option ${y === year ? "active" : ""}`}
              onClick={() => {
                onChange(y);
                setOpen(false);
              }}
            >
              {y}
              {y === year && <span className="check">✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const YearCalendarHeader = ({
  year,
  availableYears,
  currentStreak,
  longestStreak,
  onYearChange,
}) => {
  return (
    <div className="calendar-header">
      <div className="calendar-meta">
        {/* 🔁 REPLACED SELECT */}
        <YearDropdown
          year={year}
          availableYears={availableYears}
          onChange={onYearChange}
        />

        <div className="streak-summary">
          <span>
            Current streak<strong>{currentStreak}</strong>
          </span>
          <span>
            Longest streak<strong>{longestStreak}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default YearCalendarHeader;
