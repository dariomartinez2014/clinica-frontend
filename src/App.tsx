import { type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import ErrorBoundary from "./shared/components/ui/ErrorBoundary";
import PaginaHistorialCitas from "./pages/PaginaHistorialCitas";
import PaginaPerfil from "./pages/PaginaPerfil";
import RutaProtegida from "./components/RutaProtegida";
import PaginaSinAcceso from "./pages/PaginaSinAcceso";
import PaginaReportes from "./pages/PaginaReportes";
import PaginaCitas from "./pages/PaginaCitas";
import PaginaLogin from "./pages/PaginaLogin";

import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import PaginaDashboard from "./pages/PaginaDashboard";
import PaginaPacientes from "./pages/PaginaPacientes";
import PaginaDetallePaciente from "./pages/PaginaDetallePaciente";
import PaginaNuevaCita from "./pages/PaginaNuevaCita";
import PaginaNotFound from "./pages/PaginaNotFound";

function Seccion({ children, nombre }: { children: ReactNode; nombre: string }) {
  const location = useLocation();
  return <ErrorBoundary key={location.pathname} nombre={nombre}>{children}</ErrorBoundary>;
}

export default function App() {
  // Layout es el padre y Outlet muestra la página que corresponde.
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />
      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Seccion nombre="el dashboard"><PaginaDashboard /></Seccion>} />
          <Route path="/perfil" element={<Seccion nombre="el perfil"><PaginaPerfil /></Seccion>} />
          <Route path="/pacientes" element={<Seccion nombre="los pacientes"><PaginaPacientes /></Seccion>} />
          <Route path="/pacientes/:id" element={<Seccion nombre="el expediente"><PaginaDetallePaciente /></Seccion>} />
          <Route path="/sin-acceso" element={<PaginaSinAcceso />} />
          <Route element={<RutaProtegida rolesPermitidos={["GERENCIA", "ADMIN"]} />}>
            <Route path="/reportes" element={<Seccion nombre="los reportes"><PaginaReportes /></Seccion>} />
          </Route>
          <Route path="/historial" element={<Seccion nombre="el historial"><PaginaHistorialCitas /></Seccion>} />
          <Route path="/citas" element={<Seccion nombre="la agenda"><PaginaCitas /></Seccion>} />
          <Route path="/citas/nueva" element={<Seccion nombre="el formulario de citas"><PaginaNuevaCita /></Seccion>} />
          <Route path="*" element={<PaginaNotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}
