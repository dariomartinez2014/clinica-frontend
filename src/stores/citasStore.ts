import { create } from "zustand";
import { devtools } from "zustand/middleware";
import * as servicio from "../services/citas";
import type { CrearCitaDTO } from "../services/citas";
import type { Cita, EstadoCita } from "../types/cita";
import { extraerMensajeError } from "../lib/errorHandler";
interface CitasState {
  citas: Cita[];
  mostrarCitas: (citas: Cita[]) => void;
  citaSeleccionada: Cita | null;
  cargando: boolean;
  error: string | null;
  cargarPorPaciente: (id: number) => Promise<void>;
  cargarPorMedico: (id: number) => Promise<void>;
  seleccionar: (id: number) => void;
  actualizarEstado: (
    id: number,
    estado: Exclude<EstadoCita, "PROGRAMADA">,
  ) => Promise<void>;
  agregarCita: (datos: CrearCitaDTO) => Promise<void>;
}
let consulta = 0;
export const useCitasStore = create<CitasState>()(
  devtools(
    (set, get) => {
      const cargar = async (id: number, porPaciente: boolean) => {
        const actual = ++consulta;
        set(
          { citas: [], cargando: true, error: null, citaSeleccionada: null },
          false,
          porPaciente ? "citas/cargarPorPaciente" : "citas/cargarPorMedico",
        );
        try {
          const citas = porPaciente
            ? (await servicio.listPorPaciente(id)).data.citas
            : (await servicio.listAgenda(id)).data;
          if (actual === consulta)
            set({ citas, cargando: false }, false, "citas/cargarExito");
        } catch (err: unknown) {
          if (actual === consulta)
            set(
              { error: extraerMensajeError(err), cargando: false },
              false,
              "citas/cargarError",
            );
        }
      };
      return {
        citas: [],
        mostrarCitas: (citas) =>
          set(
            { citas, citaSeleccionada: null, error: null, cargando: false },
            false,
            "citas/mostrarCitas",
          ),
        citaSeleccionada: null,
        cargando: false,
        error: null,
        cargarPorPaciente: (id) => cargar(id, true),
        cargarPorMedico: (id) => cargar(id, false),
        seleccionar: (id) =>
          set(
            { citaSeleccionada: get().citas.find((c) => c.id === id) ?? null },
            false,
            "citas/seleccionar",
          ),
        actualizarEstado: async (id, estado) => {
          set({ error: null }, false, "citas/actualizarEstado");
          try {
            const { data } = await servicio.updateEstado(id, estado);
            ++consulta;
            set(
              (s) => ({
                citas: s.citas.map((c) =>
                  c.id === id ? { ...c, ...data } : c,
                ),
                citaSeleccionada:
                  s.citaSeleccionada?.id === id
                    ? { ...s.citaSeleccionada, ...data }
                    : s.citaSeleccionada,
                cargando: false,
              }),
              false,
              "citas/actualizarEstadoExito",
            );
          } catch (err: unknown) {
            set(
              { error: extraerMensajeError(err) },
              false,
              "citas/actualizarEstadoError",
            );
            throw err;
          }
        },
        agregarCita: async (datos) => {
          set({ error: null }, false, "citas/agregarCita");
          try {
            const { data } = await servicio.create(datos);
            ++consulta;
            set(
              (s) => ({ citas: [...s.citas, data], cargando: false }),
              false,
              "citas/agregarCitaExito",
            );
          } catch (err: unknown) {
            set(
              { error: extraerMensajeError(err) },
              false,
              "citas/agregarCitaError",
            );
            throw err;
          }
        },
      };
    },
    { name: "CitasStore", enabled: import.meta.env.DEV },
  ),
);
