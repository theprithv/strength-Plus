import api from "./api"; 

export const getExercises = async (params = {}) => {
  const res = await api.get("/exercises", { params });
  return res.data;
};

export const getExercisePR = async (exerciseId) => {
  const res = await api.get(`/exercises/${exerciseId}/pr`);
  return res.data;
};

export const getExerciseHistory = async (exerciseId) => {
  const res = await api.get(`/exercises/${exerciseId}/history`);
  return res.data;
};