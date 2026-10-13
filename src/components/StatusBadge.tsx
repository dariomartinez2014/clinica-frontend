// PROPS: activo indica si el sistema está operativo.
interface StatusBadgeProps {
  activo: boolean;
}

export default function StatusBadge({ activo }: StatusBadgeProps) {
  const color = activo
    ? 'bg-emerald-100 text-emerald-700'
    : 'bg-rose-100 text-rose-700';

  return (
    <span role="status" className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${color}`}>
      {activo ? 'Sistema Operativo' : 'Modo Mantenimiento'}
    </span>
  );
}
