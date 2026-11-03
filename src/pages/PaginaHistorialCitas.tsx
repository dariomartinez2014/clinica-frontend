// Apunte de estudio: Aquí organizo la pantalla PaginaHistorialCitas con sus datos, controles y componentes visibles.
import { useNavigate } from "react-router-dom";
import { useHistorialCitas } from "../features/citas/hooks/useHistorialCitas";
import AlertaBanner from "../shared/components/ui/AlertaBanner";
import EstadoVacio from "../shared/components/ui/EstadoVacio";
import SkeletonCitaRow from "../shared/components/ui/SkeletonCitaRow";
export default function PaginaHistorialCitas() {
  const navigate = useNavigate();
  // La página recibe el historial preparado y las acciones de navegación.
  const { entrada, setEntrada, estado, valido, cargando, error, recargar,
    citas, pagina, totalPaginas, total, cambiar, consultar } = useHistorialCitas();
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
