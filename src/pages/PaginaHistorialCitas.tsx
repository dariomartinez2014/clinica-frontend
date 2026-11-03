import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { detalle } from "../services/pacientes";
import { useApi } from "../hooks/useApi";
import AlertaBanner from "../shared/components/ui/AlertaBanner";
import EstadoVacio from "../shared/components/ui/EstadoVacio";
import SkeletonCitaRow from "../shared/components/ui/SkeletonCitaRow";
import type { Cita } from "../types/cita";
import { paginarCitas } from "../lib/historial";

export default function PaginaHistorialCitas() {
  const [params, setParams] = useSearchParams();
  const pacienteId = Number(params.get("paciente"));
  const valido = Number.isInteger(pacienteId) && pacienteId > 0 && pacienteId <= 2147483647;
  const [entrada, setEntrada] = useState(params.get("paciente") ?? "");
  const estadoParam = params.get("estado") ?? "Todos";
  const estado = ["Todos", "PROGRAMADA", "COMPLETADA", "CANCELADA"].includes(estadoParam) ? estadoParam : "Todos";
  const numero = Number(params.get("pagina") ?? 1);
  const navigate = useNavigate();
  const obtener = useCallback(async (signal: AbortSignal): Promise<Cita[]> => valido ? (await detalle(pacienteId, signal)).data.citas : [], [pacienteId, valido]);
  const { data, cargando, error, recargar } = useApi(obtener);
  const { citas, pagina, totalPaginas, total } = paginarCitas(data ?? [], estado, numero);
  useEffect(() => {
    if (valido && data && !cargando && (params.get("pagina") !== String(pagina) || params.get("estado") !== estado)) {
      const siguientes = new URLSearchParams(params);
      siguientes.set("pagina", String(pagina)); siguientes.set("estado", estado);
      setParams(siguientes, { replace: true });
    }
  }, [valido, data, cargando, pagina, estado, params, setParams]);
  function cambiar(pagina: number, filtro = estado) {
    setParams({ paciente: String(pacienteId), estado: filtro, pagina: String(pagina) });
  }
  function consultar(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setParams({ paciente: entrada, estado: "Todos", pagina: "1" }); }
  return <main className="mx-auto max-w-6xl px-6 py-8">
    <h1 className="text-3xl font-bold">Historial de citas</h1><p className="mt-2 text-slate-600">Consulta las citas de un paciente y comparte la página y el filtro mediante la URL.</p>
    <form onSubmit={consultar} className="my-6 flex flex-wrap items-end gap-3"><label className="text-sm font-medium">ID del paciente<input aria-label="ID del paciente" type="number" min="1" max="2147483647" step="1" required value={entrada} onChange={event => setEntrada(event.target.value)} className="mt-1 block rounded-lg border border-slate-300 px-3 py-2" /></label><button className="rounded-lg bg-emerald-700 px-4 py-2 text-white">Consultar historial</button></form>
    {valido && <label className="mb-5 block text-sm font-medium">Estado de la cita<select aria-label="Estado del historial" value={estado} onChange={event => cambiar(1, event.target.value)} className="ml-3 rounded border border-slate-300 p-2">{["Todos", "PROGRAMADA", "COMPLETADA", "CANCELADA"].map(e => <option key={e}>{e}</option>)}</select></label>}
    {!valido ? <EstadoVacio titulo="Selecciona un paciente" descripcion="Introduce su ID o abre el historial desde su expediente." accion={{ label: "Ver pacientes", onClick: () => navigate("/pacientes") }} />
    : cargando ? <div role="status" aria-label="Cargando historial" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[0,1,2,3,4,5].map(i => <SkeletonCitaRow key={i} />)}</div>
    : error ? <AlertaBanner tipo="error" mensaje={error} accion={{ label: "Reintentar", onClick: recargar }} />
    : !total ? <EstadoVacio titulo="No hay citas para este filtro" descripcion="Puedes cambiar el estado o registrar la primera cita." accion={{ label: "Agendar cita", onClick: () => navigate("/citas/nueva") }} />
    : <><p className="mb-4 text-sm text-slate-500">{total} citas · Página {pagina} de {totalPaginas}</p><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{citas.map(cita => <article key={cita.id} className="min-h-[280px] rounded-xl border border-slate-200 bg-white p-5"><h2 className="font-bold">Cita #{cita.id}</h2><p className="mt-4 text-sm">{cita.estado}</p><p className="mt-4"><time dateTime={cita.fecha}>{new Date(cita.fecha).toLocaleString("es-GT")}</time></p><p className="mt-4 text-slate-600">{cita.motivo || "Sin motivo registrado"}</p></article>)}</div><nav aria-label="Páginas del historial" className="mt-6 flex items-center gap-4"><button disabled={pagina <= 1} onClick={() => cambiar(pagina - 1)} className="rounded border px-4 py-2 disabled:opacity-40">Anterior</button><span aria-live="polite">Página {pagina} de {totalPaginas}</span><button disabled={pagina >= totalPaginas} onClick={() => cambiar(pagina + 1)} className="rounded border px-4 py-2 disabled:opacity-40">Siguiente</button></nav></>}
  </main>;
}
