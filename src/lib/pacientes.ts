import type { Paciente, EstadoPaciente } from '../types/paciente';

// Datos que devuelve Express. Algunos campos del MP1 son opcionales.
export interface PacienteAPI {
  id: number | string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  estado?: EstadoPaciente;
  especialidadAsignada?: string;
  ultimaCita?: string;
}

export function presentarPaciente(paciente: PacienteAPI): Paciente {
  return {
    id: String(paciente.id),
    nombre: paciente.nombre,
    apellido: paciente.apellido,
    email: paciente.email,
    telefono: paciente.telefono ?? 'Sin registrar',
    estado: paciente.estado ?? 'sin_datos',
    especialidadAsignada: paciente.especialidadAsignada ?? 'Sin información',
    ultimaCita: paciente.ultimaCita ?? '',
  };
}
