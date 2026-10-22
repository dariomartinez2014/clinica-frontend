import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import type { Cita } from "../types/cita";
import { listAgenda } from "../services/citas";
import { extraerMensajeError } from "../lib/errorHandler";
import CitaCard from "../components/CitaCard";
import Cargando from "../components/Cargando";

export default function PaginaCitas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [medicoId, setMedicoId] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [consultado, setConsultado] = useState(false);
  const peticion = useRef<AbortController | null>(null);
  useEffect(() => () => peticion.current?.abort(), []);
  async function cargar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    peticion.current?.abort();
    const controller = new AbortController();
    peticion.current = controller;
    setCargando(true);
    setError("");
    setConsultado(true);
    try {
      const { data } = await listAgenda(Number(medicoId), controller.signal);
      if (!controller.signal.aborted) setCitas(data);
    } catch (err: unknown) {
      if (!controller.signal.aborted) {
        const mensaje = extraerMensajeError(err);
        setError(mensaje);
        toast.error(mensaje);
      }
    } finally {
      if (!controller.signal.aborted) setCargando(false);
    }
  }
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-3xl font-bold">Agenda de citas</h1>
      <p className="mt-2 text-slate-600">
        Consulta la agenda del médico y actualiza sus citas.
      </p>
      <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Esta sección requiere una cuenta con rol MEDICO. Las cuentas de
        recepción registran pacientes y agendan citas, pero no cambian su
        estado.
      </p>
      <form
        onSubmit={(event) => {
          void cargar(event);
        }}
        className="my-6 flex flex-wrap items-end gap-3"
      >
        <label className="text-sm font-medium">
          ID del médico
          <input
            aria-label="ID del médico"
            type="number"
            min="1"
            max="2147483647"
            step="1"
            required
            value={medicoId}
            onChange={(event) => setMedicoId(event.target.value)}
            className="mt-1 block rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <button
          disabled={cargando}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-white disabled:opacity-60"
        >
          {cargando ? "Cargando..." : "Consultar agenda"}
        </button>
      </form>
      {consultado && !cargando && !error && (
        <label className="mb-5 block text-sm">
          Buscar cita por ID, paciente o motivo
          <input
            type="search"
            aria-label="Buscar citas"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            className="mt-1 block w-full max-w-lg rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
      )}
      {cargando ? (
        <Cargando />
      ) : error ? (
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">
          No se pudo cargar la agenda: {error}. Comprueba el rol y el ID, e
          intenta consultar de nuevo.
        </p>
      ) : consultado && citas.length === 0 ? (
        <p>No hay citas para este médico.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {citas
            .filter((cita) =>
              [
                cita.id,
                cita.paciente?.nombre,
                cita.paciente?.apellido,
                cita.motivo,
              ]
                .join(" ")
                .toLowerCase()
                .includes(busqueda.toLowerCase()),
            )
            .map((cita) => (
              <CitaCard
                key={cita.id}
                cita={cita}
                onActualizar={(actualizada) =>
                  setCitas((prev) =>
                    prev.map((item) =>
                      item.id === actualizada.id
                        ? { ...item, ...actualizada }
                        : item,
                    ),
                  )
                }
              />
            ))}
        </div>
      )}
    </main>
  );
}
