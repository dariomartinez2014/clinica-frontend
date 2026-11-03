import { useEffect } from "react";
import { usePacientesStore } from "../../../stores/pacientesStore";
import { useFiltrosStore } from "../../../stores/filtrosStore";
import { useDebounce } from "../../../hooks/useDebounce";

export function usePacientes({ cargaInicial = true, todos = false }: { cargaInicial?: boolean; todos?: boolean } = {}) {
  // AquÃ­ selecciono los datos y acciones; la pÃ¡gina ya no necesita conocer Zustand.
  const pacientes = usePacientesStore(s => s.pacientes);
  const total = usePacientesStore(s => s.total);
  const pagina = usePacientesStore(s => s.pagina);
  const totalPaginas = usePacientesStore(s => s.totalPaginas);
  const cargando = usePacientesStore(s => s.cargando);
  const error = usePacientesStore(s => s.error);
  const cargar = usePacientesStore(s => s.cargar);
  const cancelarCarga = usePacientesStore(s => s.cancelarCarga);
  const crear = usePacientesStore(s => s.crear);
  const actualizar = usePacientesStore(s => s.actualizar);
  const eliminar = usePacientesStore(s => s.eliminar);
  const busqueda = useFiltrosStore(s => s.queryPacientes);
  const especialidad = useFiltrosStore(s => s.especialidadFiltro);
  const setEspecialidad = useFiltrosStore(s => s.setEspecialidad);
  const resetFiltros = useFiltrosStore(s => s.resetFiltros);
  // Espero a que se termine de escribir para no consultar la API en cada tecla.
  const query = useDebounce(busqueda, 350);
  const buscando = cargando || busqueda !== query;
  useEffect(() => {
    // Las tarjetas solo usan acciones; el formulario de citas necesita la lista completa.
    if (!cargaInicial) return;
    void cargar(todos ? undefined : query);
    // Cancelo la consulta anterior si cambia la bÃºsqueda o salgo de la pÃ¡gina.
    return cancelarCarga;
  }, [query, cargar, cancelarCarga, cargaInicial, todos]);
  const filtrados = pacientes.filter(paciente => especialidad === "Todas" || paciente.especialidadAsignada === especialidad);
  return { pacientes, total, pagina, totalPaginas, cargando, error, cargar,
    crear, actualizar, eliminar, query, buscando, especialidad,
    setEspecialidad, resetFiltros, filtrados };
}
