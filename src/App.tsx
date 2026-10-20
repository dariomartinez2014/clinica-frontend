import PaginaLogin from './pages/PaginaLogin';
import { usePacientes } from './hooks/usePacientes';
import Cargando from './components/Cargando';
import { Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import PaginaDashboard from './pages/PaginaDashboard';
import PaginaPacientes from './pages/PaginaPacientes';
import PaginaDetallePaciente from './pages/PaginaDetallePaciente';
import PaginaNuevaCita from './pages/PaginaNuevaCita';
import PaginaNotFound from './pages/PaginaNotFound';


export default function App() {
  // La lista real se comparte con el detalle del paciente.

  const { pathname } = useLocation();
  const { pacientes, setPacientes, total, cargando, error, cargarPacientes } = usePacientes(pathname.startsWith('/pacientes'));

  // Layout es el padre y Outlet muestra la página que corresponde.
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />
      <Route element={<Layout />}>
        <Route path="/" element={<PaginaDashboard />} />
        <Route path="/pacientes" element={<PaginaPacientes pacientes={pacientes} setPacientes={setPacientes} total={total} cargando={cargando} error={error} cargarPacientes={cargarPacientes} />} />
        <Route path="/pacientes/:id" element={<>{cargando ? <Cargando /> : error ? <div role="alert" className="p-6">No se pudo cargar el paciente. <button type="button" onClick={cargarPacientes}>Reintentar</button></div> : <PaginaDetallePaciente pacientes={pacientes} />}</>} />
        <Route path="/citas/nueva" element={<PaginaNuevaCita />} />
        <Route path="*" element={<PaginaNotFound />} />
      </Route>
    </Routes>
  );
}
