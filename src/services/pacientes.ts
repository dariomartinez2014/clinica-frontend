import { api } from "../lib/axios";
import type { Coleccion } from "../lib/coleccion";
import type { RespuestaPaginada } from "../types/api";
import type { Cita } from "../types/cita";
import type { PacienteAPI } from "../lib/pacientes";



import type { CrearPacienteDTO, ActualizarPacienteDTO } from '../types/dtos';
export type { CrearPacienteDTO, ActualizarPacienteDTO } from '../types/dtos';

export const list = (signal?: AbortSignal, query?: string) =>
  api.get<Coleccion<PacienteAPI>>("/pacientes", { signal, params: { query } });
export const create = (data: CrearPacienteDTO) =>
  api.post<{ mensaje: string; paciente: PacienteAPI }>("/pacientes", data);
export const update = (id: number, data: ActualizarPacienteDTO) =>
  api.put<PacienteAPI>(`/pacientes/${id}`, data);
export const remove = (id: number) => api.delete<void>(`/pacientes/${id}`);

export const buscar = (query: string, pagina = 1, signal?: AbortSignal) =>
  api.get<RespuestaPaginada<PacienteAPI>>("/pacientes", {
    params: { query: query.trim(), pagina, limite: 12 },
    signal,
  });
export const detalle = (id: number, signal?: AbortSignal) =>
  api.get<PacienteAPI & { citas: Cita[] }>("/pacientes/" + id, { signal });
