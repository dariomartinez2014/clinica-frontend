export default function Cargando() {
  return (
    <div role="status" className="flex items-center gap-3 py-6 text-slate-600">
      <span aria-hidden="true" className="size-6 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-700" />
      Cargando datos…
    </div>
  );
}
