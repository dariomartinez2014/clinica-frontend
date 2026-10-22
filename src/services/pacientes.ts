import { api } from "../lib/axios";
import type { Coleccion } from "../lib/coleccion";
import type { PacienteAPI } from "../lib/pacientes";

export interface PacienteRegistro {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fechaNacimiento: string;
}

export type CrearPacienteDTO = Omit<PacienteRegistro, "id">;
export type ActualizarPacienteDTO = Partial<CrearPacienteDTO>;

export const list = (signal?: AbortSignal, query?: string) =>
  api.get<Coleccion<PacienteAPI>>("/pacientes", { signal, params: { query } });
export const create = (data: CrearPacienteDTO) =>
  api.post<{ mensaje: string; paciente: PacienteAPI }>("/pacientes", data);
export const update = (id: number, data: ActualizarPacienteDTO) =>
  api.put<PacienteAPI>(`/pacientes/${id}`, data);
export const remove = (id: number) => api.delete<void>(`/pacientes/${id}`);
