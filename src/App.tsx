import PaginaCitas from "./pages/PaginaCitas";
import PaginaLogin from "./pages/PaginaLogin";

import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import PaginaDashboard from "./pages/PaginaDashboard";
import PaginaPacientes from "./pages/PaginaPacientes";
import PaginaDetallePaciente from "./pages/PaginaDetallePaciente";
import PaginaNuevaCita from "./pages/PaginaNuevaCita";
import PaginaNotFound from "./pages/PaginaNotFound";

export default function App() {
  // Layout es el padre y Outlet muestra la página que corresponde.
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />
      <Route element={<Layout />}>
        <Route path="/" element={<PaginaDashboard />} />
        <Route path="/pacientes" element={<PaginaPacientes />} />
        <Route path="/pacientes/:id" element={<PaginaDetallePaciente />} />
        <Route path="/citas" element={<PaginaCitas />} />
        <Route path="/citas/nueva" element={<PaginaNuevaCita />} />
        <Route path="*" element={<PaginaNotFound />} />
      </Route>
    </Routes>
  );
}
