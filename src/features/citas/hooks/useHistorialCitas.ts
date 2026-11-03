import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { detalle } from "../../../services/pacientes";
import { useApi } from "../../../hooks/useApi";
import type { Cita } from "../../../types/cita";
import { paginarCitas } from "../../../lib/historial";

// Mantengo consulta, filtros y paginación juntos para que F5 conserve la URL.
export function useHistorialCitas() {
  const [params, setParams] = useSearchParams();
  const pacienteId = Number(params.get("paciente"));
  const valido = Number.isInteger(pacienteId) && pacienteId > 0 && pacienteId <= 2147483647;
  const [entrada, setEntrada] = useState(params.get("paciente") ?? "");
  const estadoParam = params.get("estado") ?? "Todos";
  const estado = ["Todos", "PROGRAMADA", "COMPLETADA", "CANCELADA"].includes(estadoParam) ? estadoParam : "Todos";
  const numero = Number(params.get("pagina") ?? 1);
  const obtener = useCallback(async (signal: AbortSignal): Promise<Cita[]> => valido ? (await detalle(pacienteId, signal)).data.citas : [], [pacienteId, valido]);
  const { data, cargando, error, recargar } = useApi(obtener);
  const { citas, pagina, totalPaginas, total } = paginarCitas(data ?? [], estado, numero);
  useEffect(() => {
    if (valido && data && !cargando && (params.get("pagina") !== String(pagina) || params.get("estado") !== estado)) {
      const siguientes = new URLSearchParams(params);
      siguientes.set("pagina", String(pagina)); siguientes.set("estado", estado);
      setParams(siguientes, { replace: true });
    }
  }, [valido, data, cargando, pagina, estado, params, setParams]);
  function cambiar(pagina: number, filtro = estado) {
    setParams({ paciente: String(pacienteId), estado: filtro, pagina: String(pagina) });
  }
  function consultar(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setParams({ paciente: entrada, estado: "Todos", pagina: "1" }); }
  return { entrada, setEntrada, estado, valido, cargando, error, recargar,
    citas, pagina, totalPaginas, total, cambiar, consultar };
}
