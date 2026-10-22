import PaginaCitas from "./pages/PaginaCitas";
import PaginaLogin from "./pages/PaginaLogin";
import { useEffect } from "react";
import { usePacientesStore } from "./stores/pacientesStore";
import Cargando from "./components/Cargando";
import { Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import PaginaDashboard from "./pages/PaginaDashboard";
import PaginaPacientes from "./pages/PaginaPacientes";
import PaginaDetallePaciente from "./pages/PaginaDetallePaciente";
import PaginaNuevaCita from "./pages/PaginaNuevaCita";
import PaginaNotFound from "./pages/PaginaNotFound";

export default function App() {
  const { pathname } = useLocation();
  const cargar = usePacientesStore((s) => s.cargar);
  const cargando = usePacientesStore((s) => s.cargando);
  const error = usePacientesStore((s) => s.error);
  useEffect(() => {
    if (pathname.startsWith("/pacientes")) void cargar();
  }, [pathname, cargar]);
  // Layout es el padre y Outlet muestra la página que corresponde.
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />
      <Route element={<Layout />}>
        <Route path="/" element={<PaginaDashboard />} />
        <Route path="/pacientes" element={<PaginaPacientes />} />
        <Route
          path="/pacientes/:id"
          element={
            <>
              {cargando ? (
                <Cargando />
              ) : error ? (
                <div role="alert" className="p-6">
                  No se pudo cargar el paciente.{" "}
                  <button
                    type="button"
                    onClick={() => {
                      void cargar();
                    }}
                  >
                    Reintentar
                  </button>
                </div>
              ) : (
                <PaginaDetallePaciente />
              )}
            </>
          }
        />
        <Route path="/citas" element={<PaginaCitas />} />
        <Route path="/citas/nueva" element={<PaginaNuevaCita />} />
        <Route path="*" element={<PaginaNotFound />} />
      </Route>
    </Routes>
  );
}
