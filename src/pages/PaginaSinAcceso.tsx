import { Link } from "react-router-dom";

export default function PaginaSinAcceso() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 py-12 text-center">
      <span className="rounded-full bg-amber-100 px-5 py-3 text-sm font-semibold text-amber-900">
        Acceso restringido
      </span>
      <h1 className="mt-6 text-3xl font-bold">No tienes acceso a esta sección</h1>
      <p className="mt-4 max-w-lg text-slate-600">
        Tu sesión está activa, pero tu rol no tiene los permisos necesarios para
        consultar esta página. Puedes volver al inicio y continuar en las
        secciones disponibles para tu cuenta.
      </p>
      <Link
        to="/"
        className="mt-7 rounded-lg bg-emerald-700 px-5 py-3 font-medium text-white hover:bg-emerald-800"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
