import { useAuthStore } from "../stores/authStore";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const usuario = useAuthStore((s) => s.usuario);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  function cerrarSesion() {
    logout();
    navigate("/login", { replace: true });
  }
  // NavLink marca la sección actual.
  function claseEnlace({ isActive }: { isActive: boolean }) {
    return `block rounded-lg px-4 py-3 text-sm font-medium ${isActive ? "bg-emerald-100 text-emerald-800" : "text-slate-600 hover:bg-slate-100"}`;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Menú lateral en escritorio y arriba en móvil. */}
      <aside className="border-b border-slate-200 bg-white p-5 md:fixed md:inset-y-0 md:left-0 md:w-60 md:border-r md:border-b-0">
        <p className="text-xl font-bold text-emerald-700">
          Clínica Salud Integral
        </p>
        <p className="mt-1 text-sm text-slate-500">Panel de administración</p>
        <nav
          aria-label="Navegación principal"
          className="mt-6 flex flex-wrap gap-2 md:flex-col"
        >
          <NavLink to="/" end className={claseEnlace}>
            Dashboard
          </NavLink>
          <NavLink to="/pacientes" className={claseEnlace}>
            Pacientes
          </NavLink>
          <NavLink to="/citas" end className={claseEnlace}>
            Agenda médica
          </NavLink>
          <NavLink to="/citas/nueva" className={claseEnlace}>
            Nueva cita
          </NavLink>
          <NavLink to="/reportes" className={claseEnlace}>
            Reportes
          </NavLink>
        </nav>
        <p className="mt-6 text-xs text-slate-400 md:absolute md:bottom-6">
          MP2 · Datos reales
        </p>
      </aside>
      {/* Aquí se muestra la página de cada ruta. */}
      <div className="md:ml-60">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4" aria-label="Sesión activa">
          <div className="flex items-center gap-3">
            {usuario?.foto && <img src={usuario.foto} alt="Tu foto de perfil" className="size-10 rounded-full object-cover" />}
            <div>
            <NavLink to="/perfil" className="font-semibold text-emerald-800 underline-offset-4 hover:underline" aria-label={`Editar perfil de ${usuario?.nombre ?? "usuario"}`}>{usuario?.nombre}</NavLink>
            <p className="mt-1 text-xs text-slate-500">{usuario?.rol}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={cerrarSesion}
            className="rounded-lg border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            Cerrar sesión
          </button>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
