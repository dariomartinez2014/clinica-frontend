import { lazy, Suspense } from "react";
import Spinner from "./shared/components/Spinner";
import RutaProtegida from "./components/RutaProtegida";
import PaginaLogin from "./pages/PaginaLogin";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import PaginaDashboard from "./pages/PaginaDashboard";

const PaginaSinAcceso = lazy(() => import("./pages/PaginaSinAcceso"));
const PaginaReportes = lazy(() => import("./pages/PaginaReportes"));
const PaginaCitas = lazy(() => import("./pages/PaginaCitas"));
const PaginaPacientes = lazy(() => import("./pages/PaginaPacientes"));
const PaginaDetallePaciente = lazy(() => import("./pages/PaginaDetallePaciente"));
const PaginaNuevaCita = lazy(() => import("./pages/PaginaNuevaCita"));
const PaginaNotFound = lazy(() => import("./pages/PaginaNotFound"));

export default function App() {
  // Layout es el padre y Outlet muestra la página que corresponde.
  return (
    <Suspense fallback={<Spinner fullscreen />}>
      <Routes>
        <Route path="/login" element={<PaginaLogin />} />
        <Route element={<RutaProtegida />}>
          <Route element={<Layout />}>
            <Route path="/" element={<PaginaDashboard />} />
            <Route path="/pacientes" element={<PaginaPacientes />} />
            <Route path="/pacientes/:id" element={<PaginaDetallePaciente />} />
            <Route path="/sin-acceso" element={<PaginaSinAcceso />} />
            <Route element={<RutaProtegida rolesPermitidos={["GERENCIA", "ADMIN"]} />}>
              <Route path="/reportes" element={<PaginaReportes />} />
            </Route>
            <Route path="/citas" element={<PaginaCitas />} />
            <Route path="/citas/nueva" element={<PaginaNuevaCita />} />
            <Route path="*" element={<PaginaNotFound />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
