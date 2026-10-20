import { useEffect, useState } from 'react';
import type { Medico } from '../types/medico';

// Médicos de ejemplo para el formulario del MP1.
const medicosEjemplo: Medico[] = [
  { id: 'med-1', nombre: 'Dra. Ana López', especialidad: 'Medicina general' },
  { id: 'med-2', nombre: 'Dr. Carlos Pérez', especialidad: 'Pediatría' },
  { id: 'med-3', nombre: 'Dra. Lucía García', especialidad: 'Cardiología' },
];

export function useMedicos(): { medicos: Medico[]; cargando: boolean } {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [cargando, setCargando] = useState(true);

  // Simular la espera antes de mostrar los médicos.
  useEffect(() => {
    const timer = setTimeout(() => {
      setMedicos(medicosEjemplo);
      setCargando(false);
    }, 800);

    // Cancelar la espera al salir de la página.
    return () => clearTimeout(timer);
  }, []);

  return { medicos, cargando };
}
