import axios from 'axios';
import { api } from '../lib/axios';
import { obtenerDatos } from '../lib/coleccion';
import type { Coleccion } from '../lib/coleccion';
import type { Cita } from '../types/cita';
import { normalizarEspecialidades, agruparCitasPorDia } from '../lib/reportes';
import { extraerMensajeError } from '../lib/errorHandler';

async function especialidades(signal: AbortSignal) {
  try {
    const { data } = await api.get<unknown>('/reportes/especialidades', { signal });
    return normalizarEspecialidades(data);
  } catch (err: unknown) {
    // El MP1 Express usa el nombre inglés. Solo se cambia de ruta ante 404.
    if (!axios.isAxiosError<unknown>(err) || err.response?.status !== 404) throw new Error(extraerMensajeError(err));
    const { data } = await api.get<unknown>('/reports/appointments-by-specialty', { signal });
    return normalizarEspecialidades(data);
  }
}

async function citasCompletas(signal: AbortSignal): Promise<Cita[]> {
  const citas: Cita[] = [];
  let pagina = 1;
  while (true) {
    const { data } = await api.get<Coleccion<Cita> & { totalPaginas?: number }>('/citas', { signal, params: { pagina, limite: 100 } });
    const filas = obtenerDatos(data);
    citas.push(...filas);
    if (Array.isArray(data) || (data.totalPaginas ? pagina >= data.totalPaginas : citas.length >= data.total)) break;
    if (filas.length === 0) throw new Error('La API devolvió una página vacía antes de completar las citas');
    pagina++;
  }
  return citas;
}
export async function cargarReportes(signal: AbortSignal) {
  const [porEspecialidad, citas] = await Promise.all([especialidades(signal), citasCompletas(signal)]);
  return { porEspecialidad, porDia: agruparCitasPorDia(citas) };
}
