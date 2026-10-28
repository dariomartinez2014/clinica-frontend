import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

interface RutaProtegidaProps {
  rolesPermitidos?: string[];
}

export default function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {
  const { isAuthenticated, token, usuario } = useAuthStore();

  if (!isAuthenticated || !token || !usuario) {
    return <Navigate to="/login" replace />;
  }
  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/sin-acceso" replace />;
  }
  return <Outlet />;
}
