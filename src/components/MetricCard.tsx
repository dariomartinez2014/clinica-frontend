import type { Metrica, Tendencia } from '../types';

// Datos que recibe la tarjeta.
interface MetricCardProps {
  metrica: Metrica;
}

// Color según la tendencia de la métrica.
const colorPorTendencia: Record<Tendencia, string> = {
  positiva: 'text-emerald-600',
  negativa: 'text-rose-600',
  neutra: 'text-slate-600',
};

export default function MetricCard({ metrica }: MetricCardProps) {
  return (
    <article aria-labelledby={`titulo-${metrica.id}`} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 id={`titulo-${metrica.id}`} className="font-medium text-slate-600">{metrica.titulo}</h2>
        <span aria-hidden="true" className="rounded-lg bg-slate-100 p-2 text-xl">{metrica.icono}</span>
      </div>
      <p className="my-4 text-4xl font-bold text-slate-900" aria-live={metrica.id === 'pacientes' ? 'polite' : 'off'}>
        {metrica.valor}
      </p>
      <p className={`text-sm ${colorPorTendencia[metrica.tendencia]}`}>{metrica.descripcion}</p>
    </article>
  );
}
