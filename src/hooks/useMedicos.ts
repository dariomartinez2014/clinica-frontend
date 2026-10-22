import { useEffect } from "react";
import { useMedicosStore } from "../stores/medicosStore";
export function useMedicos() {
  const medicos = useMedicosStore((s) => s.medicos);
  const cargando = useMedicosStore((s) => s.cargando);
  const error = useMedicosStore((s) => s.error);
  const cargar = useMedicosStore((s) => s.cargar);
  useEffect(() => {
    void cargar();
  }, [cargar]);
  return {
    medicos,
    cargando,
    error,
    reintentar: () => {
      void cargar();
    },
  };
}
