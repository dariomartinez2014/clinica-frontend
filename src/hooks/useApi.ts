import { useCallback, useEffect, useState } from "react";
import { extraerMensajeError } from "../lib/errorHandler";
export interface UseApiResult<T> {
  data: T | null;
  cargando: boolean;
  error: string | null;
  recargar: () => void;
}
export function useApi<T>(
  fetchFn: (signal: AbortSignal) => Promise<T>,
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contador, setContador] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    // La nueva petición vuelve a activar el indicador de carga.
    // oxlint-disable-next-line react/set-state-in-effect
    setCargando(true);
    setError(null);
    Promise.resolve()
      .then(() => fetchFn(controller.signal))
      .then((resultado) => {
        if (!controller.signal.aborted) setData(resultado);
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) setError(extraerMensajeError(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false);
      });
    return () => controller.abort();
  }, [fetchFn, contador]);
  const recargar = useCallback(() => setContador((c) => c + 1), []);
  return { data, cargando, error, recargar };
}
