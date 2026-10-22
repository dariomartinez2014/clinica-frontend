import { useState } from "react";
import toast from "react-hot-toast";
import { usePacientesStore } from "../stores/pacientesStore";
import { extraerMensajeError } from "../lib/errorHandler";
import ModalConfirmacion from "./ModalConfirmacion";
import { Link } from "react-router-dom";
import type { Paciente } from "../types/paciente";
import BadgeEstado from "./BadgeEstado";

// Datos y acciones de la tarjeta del paciente.
interface PacienteCardProps {
  paciente: Paciente;
  onEditar: () => void;
}

export default function PacienteCard({
  paciente,
  onEditar,
}: PacienteCardProps) {
  const eliminar = usePacientesStore((s) => s.eliminar);
  const [confirmando, setConfirmando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  async function confirmar() {
    if (eliminando) return;
    setEliminando(true);
    try {
      await eliminar(Number(paciente.id));
      toast.success("Paciente eliminado");
    } catch (err: unknown) {
      toast.error(extraerMensajeError(err));
    } finally {
      setEliminando(false);
    }
  }
  return (
    <article
      aria-labelledby={`nombre-${paciente.id}`}
      className="min-w-0 rounded-xl border border-slate-200 bg-white p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">{paciente.id}</p>
          <h2 id={`nombre-${paciente.id}`} className="mt-1 text-lg font-bold">
            {paciente.nombre} {paciente.apellido}
          </h2>
        </div>
        {/* Etiqueta con el estado del paciente. */}
        <BadgeEstado estado={paciente.estado} />
      </div>
      <dl className="mt-5 space-y-3 text-sm">
        <div>
          <dt className="text-slate-500">Correo electrónico</dt>
          <dd className="break-all">{paciente.email}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Teléfono</dt>
          <dd>{paciente.telefono}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Especialidad asignada</dt>
          <dd>{paciente.especialidadAsignada}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Última cita</dt>
          <dd>
            {paciente.ultimaCita ? (
              <time dateTime={paciente.ultimaCita}>{paciente.ultimaCita}</time>
            ) : (
              "Sin información"
            )}
          </dd>
        </div>
      </dl>
      <div className="mt-5 flex flex-wrap items-end gap-3">
        <button
          type="button"
          onClick={onEditar}
          className="rounded-lg border border-emerald-300 px-3 py-2 text-sm text-emerald-800"
        >
          Editar paciente
        </button>
        <button
          type="button"
          onClick={() => setConfirmando(true)}
          aria-label={`Eliminar a ${paciente.nombre} ${paciente.apellido}`}
          className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
        >
          Eliminar
        </button>
      </div>
      {/* Link cambia la URL sin recargar el documento. */}
      <Link
        to={`/pacientes/${paciente.id}`}
        className="mt-5 inline-block text-sm font-semibold text-emerald-700 hover:underline"
      >
        Ver detalle →
      </Link>
      {confirmando && (
        <ModalConfirmacion
          titulo="Eliminar paciente"
          mensaje={
            "¿Eliminar a " +
            paciente.nombre +
            " " +
            paciente.apellido +
            "? Esta acción no se puede deshacer."
          }
          cargando={eliminando}
          onCancelar={() => setConfirmando(false)}
          onConfirmar={() => {
            void confirmar();
          }}
        />
      )}
    </article>
  );
}
