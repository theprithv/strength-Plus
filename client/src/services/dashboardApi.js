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
