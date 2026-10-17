import { Link } from 'react-router-dom';

// 404: muestro esta página si no existe la ruta o el paciente solicitado.
export default function PaginaNotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-12 text-center">
      <span role="img" aria-label="Cara de sorpresa" className="text-7xl">😮</span>
      <h1 className="mt-5 text-6xl font-bold text-slate-900">404</h1>
      <p className="mt-4 text-lg text-slate-600">No encontramos la página o el paciente que buscas.</p>
      <Link to="/" className="mt-6 rounded-lg bg-emerald-700 px-5 py-3 font-medium text-white hover:bg-emerald-800">Ir al inicio</Link>
    </main>
  );
}
