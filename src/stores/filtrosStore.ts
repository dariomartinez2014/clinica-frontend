import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { EstadoCita } from "../types/cita";
interface FiltrosState {
  queryPacientes: string;
  especialidadFiltro: string;
  estadoCitaFiltro: EstadoCita | "Todos";
  setQueryPacientes: (query: string) => void;
  setEspecialidad: (especialidad: string) => void;
  setEstadoCita: (estado: EstadoCita | "Todos") => void;
  resetFiltros: () => void;
}
const inicial = {
  queryPacientes: "",
  especialidadFiltro: "Todas",
  estadoCitaFiltro: "Todos" as const,
};
export const useFiltrosStore = create<FiltrosState>()(
  devtools(
    (set) => ({
      ...inicial,
      setQueryPacientes: (queryPacientes) =>
        set({ queryPacientes }, false, "filtros/setQueryPacientes"),
      setEspecialidad: (especialidadFiltro) =>
        set({ especialidadFiltro }, false, "filtros/setEspecialidad"),
      setEstadoCita: (estadoCitaFiltro) =>
        set({ estadoCitaFiltro }, false, "filtros/setEstadoCita"),
      resetFiltros: () => set(inicial, false, "filtros/resetFiltros"),
    }),
    { name: "FiltrosStore", enabled: import.meta.env.DEV },
  ),
);
