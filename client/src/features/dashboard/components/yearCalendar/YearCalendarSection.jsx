import { useEffect, useState } from "react";
import YearCalendarHeader from "./YearCalendarHeader";
import YearHeatmapGrid from "./YearHeatmapGrid";
import api from "../../../../services/api";

const YearCalendarSection = () => {
  const [data, setData] = useState(null);
  const [year, setYear] = useState(null);

  useEffect(() => {
    fetchYear();
  }, []);

  const fetchYear = async (selectedYear) => {
    const res = await api.get("/dashboard/calendar/year", {
      params: selectedYear ? { year: selectedYear } : {},
    });

    setData(res.data);
    setYear(res.data.year);
  };

  if (!data) return null;

  return (
    <section className="section calendar-section">
      <YearCalendarHeader
        year={year}
        availableYears={data.availableYears}
        currentStreak={data.currentStreak}
        longestStreak={data.longestStreak}
        onYearChange={fetchYear}
      />

      <div className="calendar-heatmap-center">
        <YearHeatmapGrid year={year} trainedDays={data.trainedDays} />
      </div>
    </section>
  );
};

export default YearCalendarSection;
