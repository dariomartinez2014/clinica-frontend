import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { list } from "../services/medicos";
import type { Medico } from "../types/medico";
import { obtenerDatos } from "../lib/coleccion";
import { extraerMensajeError } from "../lib/errorHandler";
interface MedicosState {
  medicos: Medico[];
  cargando: boolean;
  error: string | null;
  cargar: () => Promise<void>;
}
export const useMedicosStore = create<MedicosState>()(
  devtools(
    (set, get) => ({
      medicos: [],
      cargando: false,
      error: null,
      cargar: async () => {
        if (get().cargando) return;
        set({ cargando: true, error: null }, false, "medicos/cargar");
        try {
          const { data } = await list();
          set(
            {
              medicos: obtenerDatos(data).map((m) => ({
                id: String(m.id),
                nombre: m.nombre + " " + m.apellido,
                especialidad: m.especialidad.nombre,
              })),
              cargando: false,
            },
            false,
            "medicos/cargarExito",
          );
        } catch (err: unknown) {
          set(
            { cargando: false, error: extraerMensajeError(err) },
            false,
            "medicos/cargarError",
          );
        }
      },
    }),
    { name: "MedicosStore", enabled: import.meta.env.DEV },
  ),
);
