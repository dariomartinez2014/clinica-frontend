// Apunte de estudio: Aquí consulto los médicos y entrego carga, error y reintento a los formularios.
import { useEffect } from "react";
import { useMedicosStore } from "../stores/medicosStore";
export function useMedicos() {
  const medicos = useMedicosStore((s) => s.medicos);
  const cargando = useMedicosStore((s) => s.cargando);
  const error = useMedicosStore((s) => s.error);
  const cargar = useMedicosStore((s) => s.cargar);
  // Aquí inicio o actualizo la consulta cuando cambian sus dependencias.
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
