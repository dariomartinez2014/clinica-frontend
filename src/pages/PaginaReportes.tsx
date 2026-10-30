import AlertaBanner from "../shared/components/ui/AlertaBanner";
import EstadoVacio from "../shared/components/ui/EstadoVacio";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApi } from '../hooks/useApi';
import { cargarReportes } from '../services/reportes';

export default function PaginaReportes() {
  const { data, cargando, error, recargar } = useApi(cargarReportes);
  return <main className="mx-auto max-w-6xl px-6 py-10">
    <h1 className="text-3xl font-bold">Reportes</h1>
    <p className="mt-2 mb-8 text-slate-600">Citas por especialidad y actividad de los últimos siete días. Datos reales de la API.</p>
    {cargando ? <div role="status" aria-label="Cargando reportes" className="grid gap-6 lg:grid-cols-2">{[0,1].map(i => <div key={i} className="h-96 animate-pulse motion-reduce:animate-none rounded-xl bg-slate-200" />)}</div>
    : error ? <AlertaBanner tipo="error" mensaje={error} accion={{ label: "Reintentar", onClick: recargar }} />
    : data && <div className="grid gap-6 lg:grid-cols-2">
      <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5" aria-label="Gráfica de citas por especialidad">
        <h2 className="mb-6 text-xl font-semibold">Citas por especialidad</h2>
        {data.porEspecialidad.some(d => d.total > 0) ? <ResponsiveContainer width="100%" height={300}><BarChart data={data.porEspecialidad} margin={{ bottom: 45, left: -20 }}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="especialidad" angle={-20} textAnchor="end" interval={0} height={65} tick={{fontSize: 11}}/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="total" name="Citas" fill="#4f46e5" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer> : <EstadoVacio titulo="No hay citas por especialidad" />}
      </section>
      <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5" aria-label="Gráfica de citas por día">
        <h2 className="mb-6 text-xl font-semibold">Citas por día · últimos 7 días</h2>
        {data.porDia.some(d => d.total > 0) ? <ResponsiveContainer width="100%" height={300}><LineChart data={data.porDia} margin={{left: -20}}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="dia" tick={{fontSize: 11}}/><YAxis allowDecimals={false}/><Tooltip/><Line type="monotone" dataKey="total" name="Citas" stroke="#047857" strokeWidth={3}/></LineChart></ResponsiveContainer> : <EstadoVacio titulo="No hay citas en los últimos siete días" />}
      </section>
    </div>}
  </main>;
}
