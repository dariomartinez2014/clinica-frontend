import { useState } from "react";

import FormularioPaciente from "../components/FormularioPaciente";
import PacienteCard from "../components/PacienteCard";
import BuscadorPacientes from "../components/BuscadorPacientes";
import SkeletonPacienteRow from "../shared/components/ui/SkeletonPacienteRow";
import AlertaBanner from "../shared/components/ui/AlertaBanner";
import EstadoVacio from "../shared/components/ui/EstadoVacio";

import { usePacientes } from "../features/pacientes/hooks/usePacientes";

export default function PaginaPacientes() {
  // El hook prepara los datos; aquí solo manejo el formulario y la vista.
  const { pacientes, total, pagina, totalPaginas, cargando, error, cargar,
    query, buscando, especialidad, setEspecialidad, resetFiltros, filtrados } = usePacientes();
  const [abrirFormulario, setAbrirFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const editando = pacientes.find((p) => p.id === editandoId);


  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pacientes</h1>
          <p className="mt-2 text-slate-600">
            Registro y gestión de pacientes de la clínica.
          </p>
        </div>
        <button
          onClick={() => {
            void cargar(query, pagina);
          }}
          disabled={cargando}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 disabled:opacity-50"
        >
          Actualizar lista
        </button>
      </div>
      {error && <AlertaBanner tipo="error" mensaje={error} accion={{ label: "Reintentar", onClick: () => { void cargar(query, pagina); } }} />}
      <button onClick={() => setAbrirFormulario(true)} className="mb-5 rounded-lg bg-emerald-700 px-4 py-2 text-white">Agregar paciente</button>
      <>
        <p className="mb-5 text-sm text-slate-600">
          {total} paciente(s) registrado(s)
        </p>
        {(abrirFormulario || editando) && <FormularioPaciente
          key={editando?.id ?? "nuevo"}
          paciente={editando ?? undefined}
          onGuardar={() => {
            setEditandoId(null); setAbrirFormulario(false);
            void cargar(query, pagina);
          }}
          onCancelar={() => { setEditandoId(null); setAbrirFormulario(false); }}
        />}
        <BuscadorPacientes buscando={buscando} />
        <label>
          Especialidad{" "}
          <select
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            className="m-2 rounded border p-2"
          >
            <option>Todas</option>
            {[...new Set(pacientes.map((p) => p.especialidadAsignada))].map(
              (e) => (
                <option key={e}>{e}</option>
              ),
            )}
          </select>
        </label>
        <button onClick={resetFiltros} className="rounded border px-3 py-2">
          Limpiar filtros
        </button>
        <p className="mb-4 text-sm text-slate-600">
          {buscando
            ? "Buscando pacientes..."
            : `${total} paciente(s) encontrado(s)`}
        </p>
        {!buscando && !error && filtrados.length === 0 && <EstadoVacio titulo={query || especialidad !== "Todas" ? "No hay pacientes que coincidan" : "No hay pacientes registrados"} accion={{ label: "Agregar paciente", onClick: () => setAbrirFormulario(true) }} />}
        {buscando ? <div role="status" aria-label="Cargando pacientes" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[0,1,2,3,4,5].map(i => <SkeletonPacienteRow key={i} />)}</div> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtrados.map(paciente => <PacienteCard key={paciente.id} paciente={paciente} onEditar={() => setEditandoId(paciente.id)} />)}</div>}
        {totalPaginas > 1 && (
          <nav aria-label="Páginas de pacientes" className="mt-5 flex gap-3">
            <button
              disabled={buscando || pagina <= 1}
              onClick={() => {
                void cargar(query, pagina - 1);
              }}
              className="rounded border p-2"
            >
              Anterior
            </button>
            <span>
              Página {pagina} de {totalPaginas}
            </span>
            <button
              disabled={buscando || pagina >= totalPaginas}
              onClick={() => {
                void cargar(query, pagina + 1);
              }}
              className="rounded border p-2"
            >
              Siguiente
            </button>
          </nav>
        )}
        <p className="mt-6 text-sm text-slate-500">
          Los cambios se guardan en el servidor. No se pueden eliminar pacientes
          con citas registradas.
        </p>
      </>
    </main>
  );
}
