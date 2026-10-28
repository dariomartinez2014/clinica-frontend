import { api } from "../lib/axios";
import type { Cita, EstadoCita } from "../types/cita";

import type { CrearCitaDTO } from '../types/dtos';
export type { CrearCitaDTO } from '../types/dtos';
export const create = (data: CrearCitaDTO) => api.post<Cita>("/citas", data);
export const listAgenda = (medicoId: number, signal?: AbortSignal) =>
  api.get<Cita[]>(`/medicos/${medicoId}/citas`, { signal });
export const updateEstado = (
  id: number,
  estado: Exclude<EstadoCita, "PROGRAMADA">,
) => api.patch<Cita>(`/citas/${id}/status`, { status: estado });

// El expediente ya incluye las citas del paciente.
export const listPorPaciente = (id: number) =>
  api.get<{ citas: Cita[] }>("/pacientes/" + id);
