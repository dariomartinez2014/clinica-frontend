import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/axios';
import { obtenerDatos, obtenerTotal } from '../lib/coleccion';
import type { Coleccion } from '../lib/coleccion';
import { presentarPaciente } from '../lib/pacientes';
import type { PacienteAPI } from '../lib/pacientes';
import type { Paciente } from '../types/paciente';

export function usePacientes(activo: boolean) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [intento, setIntento] = useState(0);
  const cargarPacientes = useCallback(() => setIntento(valor => valor + 1), []);

  useEffect(() => {
    if (!activo) return;
    const controller = new AbortController();
    // Esta actualización inicia el estado de la petición externa y su reintento.
    // oxlint-disable-next-line react/set-state-in-effect
    setCargando(true);
    setError(false);
    api.get<Coleccion<PacienteAPI>>('/pacientes', { signal: controller.signal })
      .then(({ data }) => {
        if (controller.signal.aborted) return;
        setPacientes(obtenerDatos(data).map(presentarPaciente));
        setTotal(obtenerTotal(data));
      })
      .catch(() => { if (!controller.signal.aborted) setError(true); })
      .finally(() => { if (!controller.signal.aborted) setCargando(false); });
    return () => controller.abort();
  }, [activo, intento]);

  return { pacientes, setPacientes, total, cargando, error, cargarPacientes };
}
