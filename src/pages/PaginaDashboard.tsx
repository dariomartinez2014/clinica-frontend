import { useCallback, useEffect, useMemo } from "react";
import { useDashboardStore } from "../stores/dashboardStore";
import { Link } from "react-router-dom";
import MetricCard from "../components/MetricCard";
import Spinner from "../shared/components/Spinner";

import type { Metrica } from "../types";

export default function PaginaDashboard() {
  const totales = useDashboardStore((s) => s.totales);
  const cargando = useDashboardStore((s) => s.cargando);
  const error = useDashboardStore((s) => s.error);
  const cargar = useDashboardStore((s) => s.cargar);
  useEffect(() => {
    void cargar();
  }, [cargar]);
  const actualizarDatos = useCallback(() => {
    void cargar();
  }, [cargar]);

  // Solo recalculo las métricas cuando cambian los datos del store.
  const metricas = useMemo<Metrica[]>(() => {
    const totalPacientes = totales?.[0] ?? 0;
    const totalMedicos = totales?.[1] ?? 0;
    const programadas = totales?.[2] ?? 0;
    const completadas = totales?.[3] ?? 0;
    const totalCitas = totales?.[4] ?? 0;
    const porcentajeCompletadas = totalCitas > 0
      ? Math.round((completadas / totalCitas) * 100)
      : 0;

    return [
      { id: "pacientes", titulo: "Pacientes", valor: totalPacientes, descripcion: "Total de pacientes registrados", tendencia: "neutra", icono: "👥" },
      { id: "medicos", titulo: "Médicos", valor: totalMedicos, descripcion: "Total de médicos registrados", tendencia: "neutra", icono: "🩺" },
      { id: "programadas", titulo: "Citas programadas", valor: programadas, descripcion: "Citas pendientes de atención", tendencia: "neutra", icono: "📅" },
      { id: "completadas", titulo: "Citas completadas", valor: completadas, descripcion: "Total de citas completadas", tendencia: "neutra", icono: "✅" },
      { id: "porcentaje", titulo: "% de citas completadas", valor: `${porcentajeCompletadas}%`, descripcion: `${completadas} de ${totalCitas} citas`, tendencia: "neutra", icono: "📊" },
    ];
  }, [totales]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          type="button"
          onClick={actualizarDatos}
          disabled={cargando}
          className="rounded-lg bg-emerald-700 px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {cargando ? "Actualizando..." : "Actualizar datos"}
        </button>
      </div>
      <p className="mt-2 mb-8 text-slate-600">
        Resumen general de la clínica con datos reales.
      </p>
      {cargando ? (
        <Spinner />
      ) : error ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-800"
        >
          <p>
            No se pudieron cargar las métricas. Comprueba la conexión con el
            servidor.
          </p>
          <button
            type="button"
            onClick={() => {
              void cargar();
            }}
            className="mt-3 rounded-lg border border-red-300 px-4 py-2"
          >
            Reintentar
          </button>
        </div>
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
