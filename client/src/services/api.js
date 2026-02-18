import axios from "axios";

const baseURL = import.meta.env?.VITE_API_URL;

if (!baseURL) {
  console.warn("VITE_API_URL is not defined. API calls might fail.");
}

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => {
    // Check if the request was a mutation (POST, PUT, DELETE, PATCH)
    const method = res.config.method?.toLowerCase();
    if (["post", "put", "delete", "patch"].includes(method)) {
      // Dispath explicit event for cache invalidation
      window.dispatchEvent(new Event("api-mutation-success"));
    }
    return res;
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
