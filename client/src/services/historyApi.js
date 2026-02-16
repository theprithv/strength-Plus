import api from "./api";

export const getWorkoutsByDate = async (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const formatted = `${year}-${month}-${day}`;

  const res = await api.get(`/workouts/by-date/${formatted}`);
  return res.data;
};
export const getAllWorkouts = async () => {
  const res = await api.get("/workouts");
  return res.data;
};
