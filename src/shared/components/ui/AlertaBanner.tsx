import type { ReactNode } from "react";
export interface AlertaBannerProps {
  tipo: "info" | "exito" | "advertencia" | "error";
  mensaje: string;
  accion?: { label: string; onClick: () => void };
  children?: ReactNode;
}
const colores = { info: "border-sky-200 bg-sky-50 text-sky-900", exito: "border-emerald-200 bg-emerald-50 text-emerald-900", advertencia: "border-amber-200 bg-amber-50 text-amber-900", error: "border-red-200 bg-red-50 text-red-800" };
export default function AlertaBanner({ tipo, mensaje, accion, children }: AlertaBannerProps) {
  return <div role={tipo === "error" ? "alert" : "status"} className={`my-4 rounded-xl border p-4 ${colores[tipo]}`}>
    <p>{mensaje}</p>{children}
    {accion && <button type="button" onClick={accion.onClick} className="mt-3 rounded-lg border border-current px-4 py-2 text-sm font-semibold">{accion.label}</button>}
  </div>;
}
