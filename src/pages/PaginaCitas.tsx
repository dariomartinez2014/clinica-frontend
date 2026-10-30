import { useState } from "react";
import type { FormEvent } from "react";

import { useCitasStore } from "../stores/citasStore";
import { useFiltrosStore } from "../stores/filtrosStore";

import CitaCard from "../components/CitaCard";
import SkeletonCitaRow from "../shared/components/ui/SkeletonCitaRow";
import AlertaBanner from "../shared/components/ui/AlertaBanner";
import EstadoVacio from "../shared/components/ui/EstadoVacio";
import { useNavigate } from "react-router-dom";

export default function PaginaCitas() {
  const citas = useCitasStore((s) => s.citas);
  const cargando = useCitasStore((s) => s.cargando);
  const error = useCitasStore((s) => s.error);
  const cargarPorMedico = useCitasStore((s) => s.cargarPorMedico);
  const seleccionada = useCitasStore((s) => s.citaSeleccionada);
  const estadoFiltro = useFiltrosStore((s) => s.estadoCitaFiltro);
  const setEstado = useFiltrosStore((s) => s.setEstadoCita);
  const [medicoId, setMedicoId] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [consultado, setConsultado] = useState(false);
  const navigate = useNavigate();
  const filtradas = citas.filter(cita => [cita.id, cita.paciente?.nombre, cita.paciente?.apellido, cita.motivo].join(" ").toLowerCase().includes(busqueda.toLowerCase()) && (estadoFiltro === "Todos" || cita.estado === estadoFiltro));
  async function cargar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConsultado(true);
    await cargarPorMedico(Number(medicoId));
  }
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-3xl font-bold">Agenda de citas</h1>
      <p className="mt-2 text-slate-600">
        Consulta la agenda del médico y actualiza sus citas.
      </p>
      <AlertaBanner tipo="info" mensaje="La agenda requiere rol MEDICO. Recepción puede registrar pacientes y agendar citas." />
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
      <label>
        Estado{" "}
        <select
          aria-label="Filtrar estado de cita"
          value={estadoFiltro}
          onChange={(e) => {
            const value = e.target.value;
            if (
              value === "Todos" ||
              value === "PROGRAMADA" ||
              value === "COMPLETADA" ||
              value === "CANCELADA"
            )
              setEstado(value);
          }}
          className="m-2 rounded border p-2"
        >
          <option>Todos</option>
          <option>PROGRAMADA</option>
          <option>COMPLETADA</option>
          <option>CANCELADA</option>
        </select>
      </label>
      {consultado && seleccionada && (
        <p role="status" className="my-4 rounded border p-3">
          Cita #{seleccionada.id}:{" "}
          {seleccionada.motivo || "Sin motivo registrado"}
        </p>
      )}
      {error && <AlertaBanner tipo="error" mensaje={`No se pudo completar la operación: ${error}`} />}
      {cargando ? <div role="status" aria-label="Cargando agenda" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[0,1,2].map(i => <SkeletonCitaRow key={i} />)}</div>
        : consultado && !error && !filtradas.length ? <EstadoVacio titulo="No hay citas que coincidan" accion={{ label: "Agendar cita", onClick: () => navigate("/citas/nueva") }} />
        : consultado ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtradas.map(cita => <CitaCard key={cita.id} cita={cita} />)}</div> : null}
    </main>
  );
}
