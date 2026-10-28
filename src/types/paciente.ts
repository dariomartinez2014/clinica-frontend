// Estados que puede mostrar la app.
export type EstadoPaciente = "activo" | "inactivo" | "en_espera" | "sin_datos";

// Datos que usa la vista de pacientes.
export interface Paciente {
  id: string;
  fechaNacimiento?: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especialidadAsignada: string;
  ultimaCita: string;
  estado: EstadoPaciente;
}

export interface PacienteRegistro {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fechaNacimiento: string;
}
