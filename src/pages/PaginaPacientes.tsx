import { useState } from "react";

import FormularioPaciente from "../components/FormularioPaciente";
import PacienteCard from "../components/PacienteCard";
import BuscadorPacientes from "../components/BuscadorPacientes";
import Cargando from "../components/Cargando";

import { usePacientesStore } from "../stores/pacientesStore";
import { useFiltrosStore } from "../stores/filtrosStore";

export default function PaginaPacientes() {
  const pacientes = usePacientesStore((s) => s.pacientes);
  const total = usePacientesStore((s) => s.total);
  const cargando = usePacientesStore((s) => s.cargando);
  const error = usePacientesStore((s) => s.error);
  const cargar = usePacientesStore((s) => s.cargar);
  const busqueda = useFiltrosStore((s) => s.queryPacientes);
  const especialidad = useFiltrosStore((s) => s.especialidadFiltro);
  const setEspecialidad = useFiltrosStore((s) => s.setEspecialidad);
  const resetFiltros = useFiltrosStore((s) => s.resetFiltros);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const editando = pacientes.find((p) => p.id === editandoId);
  const filtrados = pacientes.filter(
    (paciente) =>
      `${paciente.nombre} ${paciente.apellido} ${paciente.email}`
        .toLowerCase()
        .includes(busqueda.toLowerCase()) &&
      (especialidad === "Todas" ||
        paciente.especialidadAsignada === especialidad),
  );

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
            void cargar();
          }}
          disabled={cargando}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 disabled:opacity-50"
        >
          Actualizar lista
        </button>
      </div>
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg bg-red-50 p-5 text-red-800"
        >
          <p>No se pudo completar la operación: {error}</p>
          <button
            onClick={() => {
              void cargar();
            }}
            className="mt-3 rounded-lg border border-red-300 px-4 py-2"
          >
            Reintentar
          </button>
        </div>
      )}
      {cargando ? (
        <Cargando />
      ) : (
        <>
          <p className="mb-5 text-sm text-slate-600">
            {total} paciente(s) registrado(s)
          </p>
          <FormularioPaciente
            key={editando?.id ?? "nuevo"}
            paciente={editando ?? undefined}
            onGuardar={() => setEditandoId(null)}
            onCancelar={editando ? () => setEditandoId(null) : undefined}
          />
          <BuscadorPacientes />
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
            {filtrados.length} paciente(s) encontrado(s)
          </p>
          {filtrados.length === 0 && (
            <p className="text-slate-500">
              No hay pacientes que coincidan con la búsqueda.
            </p>
          )}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtrados.map((paciente) => (
              <PacienteCard
                key={paciente.id}
                paciente={paciente}
                onEditar={() => setEditandoId(paciente.id)}
              />
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Los cambios se guardan en el servidor. No se pueden eliminar
            pacientes con citas registradas.
          </p>
        </>
      )}
    </main>
  );
}
