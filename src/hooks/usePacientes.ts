import { useCallback, useEffect, useState } from "react";
import * as servicio from "../services/pacientes";
import toast from "react-hot-toast";
import { extraerMensajeError } from "../lib/errorHandler";
import { obtenerDatos, obtenerTotal } from "../lib/coleccion";

import { presentarPaciente } from "../lib/pacientes";

import type { Paciente } from "../types/paciente";

export function usePacientes(activo: boolean) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [intento, setIntento] = useState(0);
  const cargarPacientes = useCallback(
    () => setIntento((valor) => valor + 1),
    [],
  );

  useEffect(() => {
    if (!activo) return;
    const controller = new AbortController();
    // Mostrar la carga también al reintentar.
    // oxlint-disable-next-line react/set-state-in-effect
    setCargando(true);
    setError(false);
    servicio
      .list(controller.signal)
      .then(({ data }) => {
        if (controller.signal.aborted) return;
        setPacientes(obtenerDatos(data).map(presentarPaciente));
        setTotal(obtenerTotal(data));
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setError(true);
          toast.error(extraerMensajeError(err));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false);
      });
    return () => controller.abort();
  }, [activo, intento]);

  return {
    pacientes,
    setPacientes,
    total,
    setTotal,
    cargando,
    error,
    cargarPacientes,
  };
}
