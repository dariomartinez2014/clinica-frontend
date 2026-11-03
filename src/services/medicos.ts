// Apunte de estudio: Aquí agrupo las peticiones de medicos para que los componentes no repitan las llamadas HTTP.
import { api } from "../lib/axios";
import type { Coleccion } from "../lib/coleccion";

export interface MedicoAPI {
  id: number;
  nombre: string;
  apellido: string;
  especialidad: { nombre: string };
}
export const list = (signal?: AbortSignal) =>
  api.get<Coleccion<MedicoAPI>>("/medicos", { signal });
