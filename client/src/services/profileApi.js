import api from "./api";

export const getProfile = () =>
  api.get("/profile", {
    validateStatus: (status) => status === 200 || status === 404,
  });

export const createProfile = (data) => api.post("/profile", data);
export const updateProfile = async (profileData) => {
  const res = await api.put("/profile", profileData);
  return res.data;
};

export const updatePRSlot = async (slotIndex, exerciseId) => {
  const res = await api.post("/user-panel/pr-slots", { slotIndex, exerciseId });
  return res.data;
};
