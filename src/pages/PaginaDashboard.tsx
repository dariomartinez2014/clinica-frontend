import toast from "react-hot-toast";
import { extraerMensajeError } from "../lib/errorHandler";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MetricCard from "../components/MetricCard";
import Cargando from "../components/Cargando";
import { api } from "../lib/axios";
import { obtenerTotal } from "../lib/coleccion";
import type { Coleccion } from "../lib/coleccion";
import type { Metrica } from "../types";

export default function PaginaDashboard() {
  const [totales, setTotales] = useState<number[] | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    // Mostrar la carga mientras llegan los totales.
    // oxlint-disable-next-line react/set-state-in-effect
    setCargando(true);
    setError(false);
    const cargar = async () => {
      try {
        const respuestas = await Promise.all([
          api.get<Coleccion<unknown>>("/pacientes", {
            signal: controller.signal,
          }),
          api.get<Coleccion<unknown>>("/medicos", {
            signal: controller.signal,
          }),
          api.get<Coleccion<unknown>>("/citas", {
            params: { estado: "Programada" },
            signal: controller.signal,
          }),
          api.get<Coleccion<unknown>>("/citas", {
            params: { estado: "Completada" },
            signal: controller.signal,
          }),
        ]);
        if (!controller.signal.aborted)
          setTotales(respuestas.map(({ data }) => obtenerTotal(data)));
      } catch (err: unknown) {
        if (!controller.signal.aborted) {
          setError(true);
          toast.error(extraerMensajeError(err));
        }
      } finally {
        if (!controller.signal.aborted) setCargando(false);
      }
    };
    void cargar();
    return () => controller.abort();
  }, [intento]);

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
        <Cargando />
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
            onClick={() => setIntento((valor) => valor + 1)}
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
    </main>
  );
}
