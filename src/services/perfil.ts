import { api } from "../lib/axios";
import type { Usuario } from "../types/usuario";
export async function actualizarPerfil(formData: FormData): Promise<Usuario> {
  // Axios y el navegador generan Content-Type y boundary para el archivo.
  const { data } = await api.put<Usuario>("/auth/perfil", formData);
  return data;
}
