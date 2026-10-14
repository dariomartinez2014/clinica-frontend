import type { EstadoPaciente } from '../types/paciente';

// PROPS: recibo solamente el estado que voy a mostrar.
interface BadgeEstadoProps {
  estado: EstadoPaciente;
}

// ETIQUETAS Y COLORES: cada estado tiene su propio estilo y texto.
const configuracionEstado: Record<EstadoPaciente, { texto: string; color: string }> = {
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
