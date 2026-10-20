import type { EstadoPaciente } from '../types/paciente';

// Estado que muestra la etiqueta.
interface BadgeEstadoProps {
  estado: EstadoPaciente;
}

// Texto y color de cada estado.
const configuracionEstado: Record<EstadoPaciente, { texto: string; color: string }> = {
  sin_datos: { texto: 'Sin información', color: 'bg-slate-100 text-slate-700' },
  activo: { texto: 'Activo', color: 'bg-emerald-100 text-emerald-700' },
  inactivo: { texto: 'Inactivo', color: 'bg-slate-100 text-slate-700' },
  en_espera: { texto: 'En espera', color: 'bg-amber-100 text-amber-800' },
};

export default function BadgeEstado({ estado }: BadgeEstadoProps) {
  const configuracion = configuracionEstado[estado];
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${configuracion.color}`}>
      {configuracion.texto}
    </span>
  );
}
