export interface EstadoVacioProps {
  titulo: string;
  descripcion?: string;
  accion?: { label: string; onClick: () => void };
}
export default function EstadoVacio({ titulo, descripcion, accion }: EstadoVacioProps) {
  return <div className="my-5 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
    <h2 className="text-lg font-semibold text-slate-800">{titulo}</h2>
    {descripcion && <p className="mt-2 text-sm text-slate-500">{descripcion}</p>}
    {accion && <button type="button" onClick={accion.onClick} className="mt-5 rounded-lg bg-emerald-700 px-4 py-2 font-medium text-white">{accion.label}</button>}
  </div>;
}
