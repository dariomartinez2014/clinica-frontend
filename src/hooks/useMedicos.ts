import { useEffect, useState } from "react";
import { list } from "../services/medicos";
import { obtenerDatos } from "../lib/coleccion";
import { extraerMensajeError } from "../lib/errorHandler";
import type { Medico } from "../types/medico";

export function useMedicos() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [intento, setIntento] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    // Empieza una nueva consulta a la API.
    // oxlint-disable-next-line react/set-state-in-effect
    setCargando(true);
    setError("");
    list(controller.signal)
      .then(({ data }) => {
        if (!controller.signal.aborted)
          setMedicos(
            obtenerDatos(data).map((medico) => ({
              id: String(medico.id),
              nombre: `${medico.nombre} ${medico.apellido}`,
              especialidad: medico.especialidad.nombre,
            })),
          );
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) setError(extraerMensajeError(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false);
      });
    return () => controller.abort();
  }, [intento]);
  return {
    medicos,
    cargando,
    error,
    reintentar: () => setIntento((valor) => valor + 1),
  };
}
