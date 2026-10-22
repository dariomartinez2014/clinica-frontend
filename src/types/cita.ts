export type EstadoCita = "PROGRAMADA" | "COMPLETADA" | "CANCELADA";
export interface Cita {
  id: number;
  pacienteId: number;
  medicoId: number;
  fecha: string;
  motivo?: string | null;
  estado: EstadoCita;
  paciente?: { nombre: string; apellido: string };
}
