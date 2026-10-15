import { useEffect, useState } from 'react';
import type { Medico } from '../types/medico';

// DATOS DE PRÁCTICA: simulo la respuesta de un servidor.
const medicosEjemplo: Medico[] = [
  { id: 'med-1', nombre: 'Dra. Ana López', especialidad: 'Medicina general' },
  { id: 'med-2', nombre: 'Dr. Carlos Pérez', especialidad: 'Pediatría' },
  { id: 'med-3', nombre: 'Dra. Lucía García', especialidad: 'Cardiología' },
];

export function useMedicos(): { medicos: Medico[]; cargando: boolean } {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [cargando, setCargando] = useState(true);

  // CARGA: espero 800 ms y después muestro los médicos disponibles.
  useEffect(() => {
    const timer = setTimeout(() => {
      setMedicos(medicosEjemplo);
      setCargando(false);
    }, 800);

    // LIMPIEZA: cancelo el timer si salgo de la página antes de que termine.
    return () => clearTimeout(timer);
  }, []);

  return { medicos, cargando };
}
