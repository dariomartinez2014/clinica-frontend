import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import type { Paciente } from "../types/paciente";
import FormularioPaciente from "../components/FormularioPaciente";
import PacienteCard from "../components/PacienteCard";
import BuscadorPacientes from "../components/BuscadorPacientes";
import Cargando from "../components/Cargando";
import ModalConfirmacion from "../components/ModalConfirmacion";
import * as servicio from "../services/pacientes";
import { extraerMensajeError } from "../lib/errorHandler";

interface Props {
  total: number;
  setTotal: Dispatch<SetStateAction<number>>;
  cargando: boolean;
  error: boolean;
  cargarPacientes: () => void;
  pacientes: Paciente[];
  setPacientes: Dispatch<SetStateAction<Paciente[]>>;
}

export default function PaginaPacientes({
  pacientes,
  setPacientes,
  total,
  setTotal,
  cargando,
  error,
  cargarPacientes,
}: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState<Paciente | null>(null);
  const [porEliminar, setPorEliminar] = useState<Paciente | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const filtrados = pacientes.filter((paciente) =>
    `${paciente.nombre} ${paciente.apellido} ${paciente.email}`
      .toLowerCase()
      .includes(busqueda.toLowerCase()),
  );

  function guardarEnLista(paciente: Paciente) {
    setPacientes((prev) =>
      editando
        ? prev.map((p) => (p.id === paciente.id ? paciente : p))
        : [...prev, paciente],
    );
    if (!editando) setTotal((prev) => prev + 1);
    setEditando(null);
  }
  async function eliminar() {
    if (!porEliminar || eliminando) return;
    setEliminando(true);
    try {
      await servicio.remove(Number(porEliminar.id));
      setPacientes((prev) => prev.filter((p) => p.id !== porEliminar.id));
      setTotal((prev) => Math.max(0, prev - 1));
      if (editando?.id === porEliminar.id) setEditando(null);
      setPorEliminar(null);
      toast.success("Paciente eliminado");
    } catch (err: unknown) {
      toast.error(extraerMensajeError(err));
    } finally {
      setEliminando(false);
    }
  }

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
          onClick={cargarPacientes}
          disabled={cargando || eliminando}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 disabled:opacity-50"
        >
          Actualizar lista
        </button>
      </div>
      {cargando ? (
        <Cargando />
      ) : error ? (
        <div role="alert" className="rounded-lg bg-red-50 p-5 text-red-800">
          <p>No se pudieron cargar los pacientes.</p>
          <button
            onClick={cargarPacientes}
            className="mt-3 rounded-lg border border-red-300 px-4 py-2"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          <p className="mb-5 text-sm text-slate-600">
            {total} paciente(s) registrado(s)
          </p>
          <FormularioPaciente
            key={editando?.id ?? "nuevo"}
            paciente={editando ?? undefined}
            onGuardar={guardarEnLista}
            onCancelar={editando ? () => setEditando(null) : undefined}
          />
          <BuscadorPacientes value={busqueda} onChange={setBusqueda} />
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
                onEditar={() => setEditando(paciente)}
                onEliminar={() => setPorEliminar(paciente)}
              />
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Los cambios se guardan en el servidor. No se pueden eliminar
            pacientes con citas registradas.
          </p>
        </>
      )}
      {porEliminar && (
        <ModalConfirmacion
          titulo="Eliminar paciente"
          mensaje={`¿Eliminar a ${porEliminar.nombre} ${porEliminar.apellido}? Esta acción no se puede deshacer.`}
          cargando={eliminando}
          onCancelar={() => setPorEliminar(null)}
          onConfirmar={() => {
            void eliminar();
          }}
        />
      )}
    </main>
  );
}
