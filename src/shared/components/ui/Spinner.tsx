interface SpinnerProps { fullscreen?: boolean; etiqueta?: string }
export default function Spinner({ fullscreen = false, etiqueta = "Cargando" }: SpinnerProps) {
  return <div role="status" aria-label={etiqueta} className={fullscreen ? "fixed inset-0 z-50 flex items-center justify-center bg-white/80" : "inline-flex items-center gap-2 align-middle"}>
    <span aria-hidden="true" className={`${fullscreen ? "size-10" : "inline-block h-4 w-4"} animate-spin rounded-full border-2 border-slate-300 border-t-emerald-700 motion-reduce:animate-none`} />
    <span className="sr-only">{etiqueta}</span>
  </div>;
}
