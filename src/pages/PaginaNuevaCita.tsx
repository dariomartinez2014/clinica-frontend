import FormularioCita from '../components/FormularioCita';
import { useNavigate } from 'react-router-dom';

// PÁGINA: reúno el encabezado y el formulario de la actividad del día 4.
export default function PaginaNuevaCita() {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <p className="font-semibold text-emerald-700">Clínica Salud Integral</p>
        <h1 className="mt-2 text-3xl font-bold">Nueva cita</h1>
        <p className="mb-6 mt-2 text-slate-600">Agenda una consulta con nuestros médicos.</p>
        <FormularioCita />
        {/* CANCELAR: regreso a la página anterior usando el historial. */}
        <button type="button" onClick={() => navigate(-1)} className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100">Cancelar</button>
        <p className="mt-4 text-sm text-slate-500">Ejercicio con datos ficticios. Las citas no se envían a un servidor y se reinician al recargar.</p>
      </div>
    </main>
  );
}
