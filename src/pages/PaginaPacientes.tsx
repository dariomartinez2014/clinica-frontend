import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { EstadoPaciente, Paciente } from '../types/paciente';
import FormularioPaciente from '../components/FormularioPaciente';
import PacienteCard from '../components/PacienteCard';
import BuscadorPacientes from '../components/BuscadorPacientes';
import { pacientesEjemplo } from '../data/pacientes';

export default function PaginaPacientes() {
  const [busqueda, setBusqueda] = useState<string>('');
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoPaciente | 'Todos'>('Todos');
  const [pacientes, setPacientes] = useState<Paciente[]>(pacientesEjemplo);
  const [mensaje, setMensaje] = useState('');

  // La lista filtrada se deriva del estado; nunca reemplaza el arreglo original.
  const pacientesFiltrados = pacientes.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
    (estadoFiltro === 'Todos' || p.estado === estadoFiltro)
  );

  function agregar(paciente: Paciente) {
    setPacientes(prev => [...prev, paciente]);
    setMensaje(`Paciente ${paciente.nombre} agregado. Si no aparece, revisa los filtros activos.`);
  }

  function cambiarEstado(id: string, estado: EstadoPaciente) {
    setPacientes(prev => prev.map(p => p.id === id ? { ...p, estado } : p));
    setMensaje('Estado actualizado.');
  }

  function eliminar(id: string) {
    const paciente = pacientes.find(p => p.id === id);
    if (!paciente || !window.confirm(`¿Eliminar a ${paciente.nombre} ${paciente.apellido}?`)) return;
    setPacientes(prev => prev.filter(p => p.id !== id));
    setMensaje(`Paciente ${paciente.nombre} eliminado.`);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto max-w-6xl">
          <p className="text-xl font-bold text-emerald-700">Clínica Salud Integral</p>
          <p className="mt-1 text-sm text-slate-500">Panel de administración</p>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-3xl font-bold">Pacientes</h1>
        <p className="mt-2 text-slate-600">Directorio de pacientes de la clínica.</p>
        <BuscadorPacientes value={busqueda} onChange={setBusqueda} />
        <div className="mb-6 flex flex-wrap items-end gap-4">
          <label htmlFor="filtro-estado" className="text-sm font-medium">Filtrar por estado
            <select id="filtro-estado" value={estadoFiltro}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => setEstadoFiltro(event.target.value as EstadoPaciente | 'Todos')}
              className="mt-2 block rounded-lg border border-slate-300 bg-white px-3 py-2">
              <option value="Todos">Todos</option><option value="activo">Activo</option><option value="inactivo">Inactivo</option><option value="en_espera">En espera</option>
            </select>
          </label>
          <button type="button" onClick={() => { setBusqueda(''); setEstadoFiltro('Todos'); }} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm">Limpiar filtros</button>
        </div>
        <FormularioPaciente onAgregar={agregar} />
        <p role="status" className="mb-3 text-sm text-emerald-800">{mensaje}</p>
        <p className="mb-4 text-sm text-slate-600">{pacientesFiltrados.length} paciente(s) encontrado(s)</p>
        {pacientesFiltrados.length === 0 && <p className="mb-4 text-slate-600">No hay pacientes que coincidan con los filtros.</p>}
        {/* RESPONSIVO: columna en móvil y grid de tarjetas desde escritorio. */}
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 xl:grid-cols-3">
          {pacientesFiltrados.map(paciente => <PacienteCard key={paciente.id} paciente={paciente} onCambiarEstado={cambiarEstado} onEliminar={eliminar} />)}
        </div>
        <p className="mt-6 text-sm text-slate-500">Datos ficticios de práctica. Los cambios se guardan solo en memoria y se reinician al recargar.</p>
      </main>
    </div>
  );
}
