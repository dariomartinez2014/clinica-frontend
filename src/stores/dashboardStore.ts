import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "../lib/axios";
import { obtenerTotal } from "../lib/coleccion";
import type { Coleccion } from "../lib/coleccion";
import { extraerMensajeError } from "../lib/errorHandler";
interface DashboardState {
  totales: number[] | null;
  cargando: boolean;
  error: string | null;
  cargar: () => Promise<void>;
}
export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set, get) => ({
      totales: null,
      cargando: false,
      error: null,
      cargar: async () => {
        if (get().cargando) return;
        set({ cargando: true, error: null }, false, "dashboard/cargar");
        try {
          const respuestas = await Promise.all([
            api.get<Coleccion<unknown>>("/pacientes"),
            api.get<Coleccion<unknown>>("/medicos"),
            api.get<Coleccion<unknown>>("/citas", {
              params: { estado: "Programada" },
            }),
            api.get<Coleccion<unknown>>("/citas", {
              params: { estado: "Completada" },
            }),
          ]);
          set(
            {
              totales: respuestas.map((r) => obtenerTotal(r.data)),
              cargando: false,
            },
            false,
            "dashboard/cargarExito",
          );
        } catch (err: unknown) {
          set(
            { cargando: false, error: extraerMensajeError(err) },
            false,
            "dashboard/cargarError",
          );
        }
      },
    }),
    { name: "DashboardStore", enabled: import.meta.env.DEV },
  ),
);
