// Apunte de estudio: Aquí cargo el expediente y compongo sus citas sin repetir la consulta del detalle.
import { useCallback } from "react";
import { useApi } from "../../../hooks/useApi";
import { detalle } from "../../../services/pacientes";
import { presentarPaciente } from "../../../lib/pacientes";
import { useCitas } from "../../citas/hooks/useCitas";

export function useDetallePaciente(id: string | undefined) {
  // Cargo el expediente cuando cambia el ID y dejo la cancelación a useApi.
  const obtener = useCallback(async (signal: AbortSignal) => (await detalle(Number(id), signal)).data, [id]);
  const { data, cargando: cargandoDetalle, error: errorDetalle, recargar } = useApi(obtener);
  const coincide = data && String(data.id) === id;
  const paciente = coincide ? presentarPaciente(data) : null;
  // Solo publico las citas cuando pertenecen al paciente que está en la URL.
  const citas = useCitas({ citasIniciales: coincide ? data.citas : undefined });
  return { ...citas, paciente, cargandoDetalle, errorDetalle, recargar };
}
