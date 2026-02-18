import api from "./api";

export const getMuscleStats = async (muscle, range = "week") => {
  const res = await api.get("/dashboard/muscle-stats", {
    params: { muscle, range },
  });
  return res.data;
};

export const getYearCalendar = async (year) => {
  const res = await api.get("/dashboard/calendar/year", {
    params: { year },
  });
  return res.data;
};

export const getGeminiInsights = () =>
  api.get("/ai/gemini/monthly-insights").then((res) => res.data);


export const getMuscleBalance = (range = "week") =>
  api
    .get("/dashboard/muscle-balance", { params: { range } })
    .then((res) => res.data);

export const getTrainingLoad = async (range = "week") => {
  const res = await api.get(`/dashboard/training-load?range=${range}`);
  return res.data;
};

// Fixed to "All" exercises as per previous logic
export const getMuscleOverloadTrend = async (muscle, range = 30) => {
  const res = await api.get(`/dashboard/muscle-overload`, {
    params: { muscle, range, exercise: "All" },
  });
  // The API returns { series: [...] } or updated format, 
  // checking previous component it used res.data.series
  return res.data.series || [];
};
