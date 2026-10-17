import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import PaginaDashboard from './pages/PaginaDashboard';
import PaginaPacientes from './pages/PaginaPacientes';
import PaginaDetallePaciente from './pages/PaginaDetallePaciente';
import PaginaNuevaCita from './pages/PaginaNuevaCita';
import PaginaNotFound from './pages/PaginaNotFound';
import { pacientesEjemplo } from './data/pacientes';
import type { Paciente } from './types/paciente';

export default function App() {
  // LISTA COMPARTIDA: conservo los cambios del día 3 al navegar al detalle.
  // Sigo usando useState y props; los datos se reinician al recargar.
  const [pacientes, setPacientes] = useState<Paciente[]>(pacientesEjemplo);

  // RUTAS: Layout es el padre y Outlet muestra la página que corresponde.
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PaginaDashboard />} />
        <Route path="/pacientes" element={<PaginaPacientes pacientes={pacientes} setPacientes={setPacientes} />} />
        <Route path="/pacientes/:id" element={<PaginaDetallePaciente pacientes={pacientes} />} />
        <Route path="/citas/nueva" element={<PaginaNuevaCita />} />
        <Route path="*" element={<PaginaNotFound />} />
      </Route>
    </Routes>
  );
}
