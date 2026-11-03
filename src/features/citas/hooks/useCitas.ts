import { useEffect } from "react";
import { useCitasStore } from "../../../stores/citasStore";
import { useFiltrosStore } from "../../../stores/filtrosStore";
import type { Cita } from "../../../types/cita";

interface OpcionesCitas {
  pacienteId?: number;
  medicoId?: number;
  citasIniciales?: Cita[];
}

export function useCitas({ pacienteId, medicoId, citasIniciales }: OpcionesCitas = {}) {
  // Junto las suscripciones y acciones de citas en una sola entrada para la vista.
  const citas = useCitasStore(s => s.citas);
  const cargando = useCitasStore(s => s.cargando);
  const error = useCitasStore(s => s.error);
  const seleccionada = useCitasStore(s => s.citaSeleccionada);
  const seleccionar = useCitasStore(s => s.seleccionar);
  const mostrarCitas = useCitasStore(s => s.mostrarCitas);
  const cargarPorPaciente = useCitasStore(s => s.cargarPorPaciente);
  const cargarPorMedico = useCitasStore(s => s.cargarPorMedico);
  const agregarCita = useCitasStore(s => s.agregarCita);
  const actualizarEstado = useCitasStore(s => s.actualizarEstado);
  const estadoFiltro = useFiltrosStore(s => s.estadoCitaFiltro);
  const setEstado = useFiltrosStore(s => s.setEstadoCita);
  useEffect(() => {
    // Si el expediente ya trajo las citas, las reutilizo sin repetir la petición.
    if (citasIniciales) mostrarCitas(citasIniciales);
    else if (pacienteId !== undefined) void cargarPorPaciente(pacienteId);
    else if (medicoId !== undefined) void cargarPorMedico(medicoId);
    // Sin un ID dejo que el formulario solicite la agenda al pulsar Consultar.
  }, [pacienteId, medicoId, citasIniciales, mostrarCitas, cargarPorPaciente, cargarPorMedico]);
  return { citas, cargando, error, seleccionada, seleccionar, mostrarCitas,
    cargarPorPaciente, cargarPorMedico, agregarCita, crear: agregarCita,
    actualizarEstado, estadoFiltro, setEstado };
}
