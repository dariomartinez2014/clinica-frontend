// Apunte de estudio: Aquí expongo los datos y acciones de sesión sin importar el store desde las páginas.
import { useAuthStore } from "../stores/authStore";

export function useAuth() {
  // La página usa esta API sin depender de cómo se guarda la sesión.
  const usuario = useAuthStore(s => s.usuario);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const login = useAuthStore(s => s.login);
  const actualizarUsuario = useAuthStore(s => s.actualizarUsuario);
  // Leo el token actual al llamar la función, incluso después de una petición.
  const obtenerToken = () => useAuthStore.getState().token;
  return { usuario, isAuthenticated, login, actualizarUsuario, obtenerToken };
}
