import { useEffect } from "react";
import { useDashboardStore } from "../stores/dashboardStore";

export function useDashboard() {
  const totales = useDashboardStore(s => s.totales);
  const cargando = useDashboardStore(s => s.cargando);
  const error = useDashboardStore(s => s.error);
  const cargar = useDashboardStore(s => s.cargar);
  // La carga inicial de las métricas queda fuera del componente de la página.
  useEffect(() => { void cargar(); }, [cargar]);
  return { totales, cargando, error, cargar };
}
