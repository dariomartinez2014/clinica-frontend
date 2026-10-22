import { useOptimistic, useTransition } from "react";
import toast from "react-hot-toast";
import type { Cita, EstadoCita } from "../types/cita";
import { updateEstado } from "../services/citas";
import { extraerMensajeError } from "../lib/errorHandler";

export default function CitaCard({
  cita,
  onActualizar,
}: {
  cita: Cita;
  onActualizar: (cita: Cita) => void;
}) {
  const [estado, mostrarEstado] = useOptimistic(
    cita.estado,
    (_actual, siguiente: EstadoCita) => siguiente,
  );
  const [guardando, startTransition] = useTransition();
  function cambiar(siguiente: Exclude<EstadoCita, "PROGRAMADA">) {
    startTransition(async () => {
      mostrarEstado(siguiente);
      try {
        const { data } = await updateEstado(cita.id, siguiente);
        onActualizar(data);
        toast.success("Estado de cita actualizado");
      } catch (err: unknown) {
        toast.error(`Cambio revertido: ${extraerMensajeError(err)}`);
      }
    });
  }
  return (
    <article
      aria-label={`Cita ${cita.id}`}
      className="rounded-xl border border-slate-200 bg-white p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-bold">Cita #{cita.id}</h2>
        <span
          aria-live="polite"
          className={`rounded-full px-3 py-1 text-xs font-semibold ${estado === "COMPLETADA" ? "bg-emerald-100 text-emerald-800" : estado === "CANCELADA" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}
        >
          {estado}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-600">
        Paciente:{" "}
        {cita.paciente
          ? `${cita.paciente.nombre} ${cita.paciente.apellido}`
          : `ID ${cita.pacienteId}`}
      </p>
      <p className="mt-2 text-sm text-slate-600">
        <time dateTime={cita.fecha}>
          {new Date(cita.fecha).toLocaleString("es-GT")}
        </time>
      </p>
      <p className="mt-2 text-sm text-slate-600">
        {cita.motivo || "Sin motivo registrado"}
      </p>
      <label
        htmlFor={`estado-cita-${cita.id}`}
        className="mt-4 block text-sm font-medium"
      >
        Estado de la cita
      </label>
      <select
        id={`estado-cita-${cita.id}`}
        value={estado}
        disabled={guardando}
        onChange={(event) => {
          const siguiente = event.target.value;
          if (siguiente === "COMPLETADA" || siguiente === "CANCELADA")
            cambiar(siguiente);
        }}
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 disabled:opacity-60"
      >
        <option value="PROGRAMADA" disabled>
          Programada
        </option>
        <option value="COMPLETADA">Completada</option>
        <option value="CANCELADA">Cancelada</option>
      </select>
      {guardando && (
        <p role="status" className="mt-2 text-sm text-slate-500">
          Guardando cambio...
        </p>
      )}
    </article>
  );
}
