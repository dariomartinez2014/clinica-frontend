import PaginaDashboard from './pages/PaginaDashboard';
import PaginaPacientes from './pages/PaginaPacientes';
import PaginaNuevaCita from './pages/PaginaNuevaCita';

// PÁGINAS: conservo el dashboard y puedo abrir pacientes desde su enlace.
// Más adelante puedo reemplazar esta selección por un router.
function App() {
  const esPacientes = window.location.pathname === '/pacientes';
  const esNuevaCita = window.location.pathname === '/citas/nueva';
  const esDashboard = !esPacientes && !esNuevaCita;

  return (
    <>
      <nav aria-label="Navegación principal" className="flex gap-5 border-b border-slate-200 bg-white px-6 py-3 text-sm font-medium">
        <a href="/" aria-current={esDashboard ? 'page' : undefined} className={esDashboard ? 'text-emerald-700 underline' : 'text-slate-600'}>Dashboard</a>
        <a href="/pacientes" aria-current={esPacientes ? 'page' : undefined} className={esPacientes ? 'text-emerald-700 underline' : 'text-slate-600'}>Pacientes</a>
        <a href="/citas/nueva" aria-current={esNuevaCita ? 'page' : undefined} className={esNuevaCita ? 'text-emerald-700 underline' : 'text-slate-600'}>Nueva cita</a>
      </nav>
      {esNuevaCita ? <PaginaNuevaCita /> : esPacientes ? <PaginaPacientes /> : <PaginaDashboard />}
    </>
  );
}

export default App;
