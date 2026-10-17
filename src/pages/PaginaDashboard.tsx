import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import type { Metrica } from '../types';

export default function PaginaDashboard() {
  const navigate = useNavigate();
  // ESTADOS: uso un estado por métrica para practicar lo del día 1.
  const [pacientes, setPacientes] = useState<number>(128);
  const [citasHoy] = useState<string>('24');
  const [consultasPendientes] = useState<string>('8');
  const [disponibilidad] = useState<string>('85%');
  const [mantenimiento, setMantenimiento] = useState<boolean>(false);

  // CONTADOR: uso el valor anterior para sumar o restar sin perder cambios.
  const incrementarPacientes = () => setPacientes(prev => prev + 1);
  const disminuirPacientes = () => setPacientes(prev => Math.max(0, prev - 1));

  // MÉTRICAS: cada objeto cumple el contrato de Metrica.
  const metricas: Metrica[] = [
    { id: 'pacientes', titulo: 'Pacientes', valor: pacientes, descripcion: '↑ 12 nuevos este mes', tendencia: 'positiva', icono: '👥' },
    { id: 'citas', titulo: 'Citas Hoy', valor: citasHoy, descripcion: 'Agenda del día', tendencia: 'neutra', icono: '📅' },
    { id: 'consultas', titulo: 'Consultas Pendientes', valor: consultasPendientes, descripcion: '↑ 3 pendientes más que ayer', tendencia: 'negativa', icono: '📋' },
    { id: 'disponibilidad', titulo: 'Disponibilidad', valor: disponibilidad, descripcion: '↑ 5 puntos esta semana', tendencia: 'positiva', icono: '🩺' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* AVISO: solo aparece cuando activo el mantenimiento. */}
      {mantenimiento && (
        <div role="alert" className="bg-rose-600 px-6 py-3 text-center font-medium text-white">
          Modo mantenimiento activo. El sistema está temporalmente en mantenimiento.
        </div>
      )}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-xl font-bold text-emerald-700">Clínica Salud Integral</p>
            <p className="mt-1 text-sm text-slate-500">Panel de administración</p>
          </div>
          <StatusBadge activo={!mantenimiento} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-5">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-2 text-slate-600">Resumen general de la clínica.</p>
          </div>
          {/* TOGGLE: la casilla cambia el estado y también el banner. */}
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
            <input
              type="checkbox"
              checked={mantenimiento}
              onChange={event => setMantenimiento(event.target.checked)}
              className="size-5 accent-rose-600"
            />
            Activar mantenimiento
          </label>
        </div>

        {/* TARJETAS: reutilizo MetricCard y paso cada métrica como prop. */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {metricas.map(metrica => <MetricCard key={metrica.id} metrica={metrica} />)}
        </div>

        <section aria-labelledby="control-pacientes" className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
          <h2 id="control-pacientes" className="text-lg font-semibold">Registro de pacientes</h2>
          <p className="mt-1 text-sm text-slate-600">Modifica la cantidad de pacientes del resumen.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {/* NAVEGACIÓN: abro pacientes sin recargar toda la aplicación. */}
            <button type="button" onClick={() => navigate('/pacientes')} className="rounded-lg border border-emerald-700 px-4 py-2 font-medium text-emerald-700 hover:bg-emerald-50">Ver Pacientes</button>
            <button
              type="button"
              aria-label="Disminuir pacientes"
              onClick={disminuirPacientes}
              disabled={pacientes === 0}
              className="rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              − Paciente
            </button>
            <button
              type="button"
              aria-label="Incrementar pacientes"
              onClick={incrementarPacientes}
              className="rounded-lg bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              + Paciente
            </button>
          </div>
        </section>
        <p className="mt-6 text-sm text-slate-500">Datos de ejemplo para la práctica. Los cambios se reinician al recargar.</p>
      </main>
    </div>
  );
}
