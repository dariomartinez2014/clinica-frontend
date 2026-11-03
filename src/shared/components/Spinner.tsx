interface Props {
  fullscreen?: boolean;
}

export default function Spinner({ fullscreen = false }: Props) {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className={fullscreen ? "flex min-h-screen items-center justify-center" : "flex justify-center py-8"}
    >
      <span aria-hidden="true" className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-700 border-t-transparent motion-reduce:animate-none" />
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
