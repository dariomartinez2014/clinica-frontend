import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
export default function RutaAutenticada() {
  const token = useAuthStore((s) => s.token);
  const usuario = useAuthStore((s) => s.usuario);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated && token && usuario ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}
