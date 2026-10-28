import axios from "axios";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("persist:auth");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const token = JSON.parse(parsed.token || "null");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // ignore parse errors
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("persist:auth");
      // Dynamic import avoids a circular import (store -> slices -> api.js -> store)
      const { store } = await import("../redux/store");
      const { logout } = await import("../redux/authSlice");
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;