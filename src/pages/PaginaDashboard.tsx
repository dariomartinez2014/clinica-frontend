import { useEffect } from "react";
import { useDashboardStore } from "../stores/dashboardStore";
import { Link } from "react-router-dom";
import MetricCard from "../components/MetricCard";
import SkeletonMetricCard from "../shared/components/ui/SkeletonMetricCard";
import AlertaBanner from "../shared/components/ui/AlertaBanner";

import type { Metrica } from "../types";

export default function PaginaDashboard() {
  const totales = useDashboardStore((s) => s.totales);
  const cargando = useDashboardStore((s) => s.cargando);
  const error = useDashboardStore((s) => s.error);
  const cargar = useDashboardStore((s) => s.cargar);
  useEffect(() => {
    void cargar();
  }, [cargar]);
  const titulos = [
    "Pacientes",
    "Médicos",
    "Citas Programadas",
    "Completadas Hoy",
  ];
  const iconos = ["👥", "🩺", "📅", "✅"];
  const metricas: Metrica[] = titulos.map((titulo, indice) => ({
    id: `metrica-${indice}`,
    titulo,
    valor: totales?.[indice] ?? "—",
    descripcion: "Total informado por la API",
    tendencia: "neutra",
    icono: iconos[indice],
  }));

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 mb-8 text-slate-600">
        Resumen general de la clínica con datos reales.
      </p>
      {cargando ? (
        <div role="status" aria-label="Cargando métricas" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[0,1,2,3].map(i => <SkeletonMetricCard key={i} />)}</div>
      ) : error ? (
        <AlertaBanner tipo="error" mensaje={`No se pudieron cargar las métricas: ${error}`} accion={{ label: "Reintentar", onClick: () => { void cargar(); } }} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {metricas.map((metrica) => (
            <MetricCard key={metrica.id} metrica={metrica} />
          ))}
        </div>
      )}
      <Link
        to="/pacientes"
        className="mt-8 inline-block rounded-lg bg-emerald-700 px-4 py-2 font-medium text-white"
      >
        Ver Pacientes
      </Link>
      <Link to="/reportes" className="ml-4 mt-8 inline-block font-medium text-emerald-700">Ver reportes completos →</Link>
    </main>
  );
}
