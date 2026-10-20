// ESTADOS: limito los valores que puede tener un paciente.
export type EstadoPaciente = 'activo' | 'inactivo' | 'en_espera' | 'sin_datos';

// PACIENTE: este contrato me indica qué datos necesita cada registro.
export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especialidadAsignada: string;
  ultimaCita: string;
  estado: EstadoPaciente;
}
