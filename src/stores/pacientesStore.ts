import { create } from "zustand";
import { devtools } from "zustand/middleware";
import * as servicio from "../services/pacientes";
import type {
  CrearPacienteDTO,
  ActualizarPacienteDTO,
} from "../services/pacientes";
import type { Paciente } from "../types/paciente";
import { presentarPaciente } from "../lib/pacientes";
import { obtenerDatos, obtenerTotal } from "../lib/coleccion";
import { extraerMensajeError } from "../lib/errorHandler";
interface PacientesState {
  pacientes: Paciente[];
  total: number;
  pagina: number;
  totalPaginas: number;
  cancelarCarga: () => void;
  cargando: boolean;
  error: string | null;
  cargar: (query?: string, pagina?: number) => Promise<void>;
  crear: (datos: CrearPacienteDTO) => Promise<void>;
  actualizar: (id: number, datos: ActualizarPacienteDTO) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
}
let consulta = 0;
let controller: AbortController | null = null;
export const usePacientesStore = create<PacientesState>()(
  devtools(
    (set) => ({
      pacientes: [],
      total: 0,
      pagina: 1,
      totalPaginas: 1,
      cancelarCarga: () => {
        ++consulta;
        controller?.abort();
        set({ cargando: false }, false, "pacientes/cancelarCarga");
      },
      cargando: false,
      error: null,
      cargar: async (query, pagina = 1) => {
        controller?.abort();
        controller = new AbortController();
        const signal = controller.signal;
        const actual = ++consulta;
        set({ cargando: true, error: null }, false, "pacientes/cargar");
        try {
          const { data } =
            query === undefined
              ? await servicio.list(signal)
              : await servicio.buscar(query, pagina, signal);
          if (actual === consulta)
            set(
              {
                pacientes: obtenerDatos(data).map(presentarPaciente),
                total: obtenerTotal(data),
                pagina:
                  !Array.isArray(data) && "pagina" in data
                    ? Number(data.pagina)
                    : 1,
                totalPaginas:
                  !Array.isArray(data) && "totalPaginas" in data
                    ? Number(data.totalPaginas)
                    : 1,
                cargando: false,
              },
              false,
              "pacientes/cargarExito",
            );
        } catch (err: unknown) {
          if (actual === consulta && !signal.aborted)
            set(
              { error: extraerMensajeError(err), cargando: false },
              false,
              "pacientes/cargarError",
            );
        }
      },
      crear: async (datos) => {
        set({ error: null }, false, "pacientes/crear");
        try {
          const { data } = await servicio.create(datos);
          ++consulta;
          set(
            (s) => ({
              pacientes: [...s.pacientes, presentarPaciente(data.paciente)],
              total: s.total + 1,
              cargando: false,
            }),
            false,
            "pacientes/crearExito",
          );
        } catch (err: unknown) {
          set(
            { error: extraerMensajeError(err) },
            false,
            "pacientes/crearError",
          );
          throw err;
        }
      },
      actualizar: async (id, datos) => {
        set({ error: null }, false, "pacientes/actualizar");
        try {
          const { data } = await servicio.update(id, datos);
          ++consulta;
          set(
            (s) => ({
              pacientes: s.pacientes.map((p) =>
                Number(p.id) === id ? presentarPaciente(data) : p,
              ),
              cargando: false,
            }),
            false,
            "pacientes/actualizarExito",
          );
        } catch (err: unknown) {
          set(
            { error: extraerMensajeError(err) },
            false,
            "pacientes/actualizarError",
          );
          throw err;
        }
      },
      eliminar: async (id) => {
        set({ error: null }, false, "pacientes/eliminar");
        try {
          await servicio.remove(id);
          ++consulta;
          set(
            (s) => ({
              pacientes: s.pacientes.filter((p) => Number(p.id) !== id),
              total: Math.max(0, s.total - 1),
              cargando: false,
            }),
            false,
            "pacientes/eliminarExito",
          );
        } catch (err: unknown) {
          set(
            { error: extraerMensajeError(err) },
            false,
            "pacientes/eliminarError",
          );
          throw err;
        }
      },
    }),
    { name: "PacientesStore", enabled: import.meta.env.DEV },
  ),
);
