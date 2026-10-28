import axios from "axios";
import { useAuthStore } from "../stores/authStore";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000,
});
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = "Bearer " + token;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const teniaSesion = useAuthStore.getState().isAuthenticated;
      useAuthStore.getState().logout();
      // En el login se conserva el formulario para mostrar el error de credenciales.
      if (error.config?.url !== "/auth/login" && teniaSesion)
        window.location.replace("/login");
    }
    return Promise.reject(error);
  },
);
