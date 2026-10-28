import type { PacienteRegistro } from './paciente';
import type { Cita, EstadoCita } from './cita';
export type CrearPacienteDTO = Omit<PacienteRegistro, 'id'>;
export type ActualizarPacienteDTO = Partial<CrearPacienteDTO>;
export type ResumenPaciente = Pick<PacienteRegistro, 'id' | 'nombre' | 'apellido' | 'email'>;
export type CrearCitaDTO = Omit<Cita, 'id' | 'estado' | 'paciente' | 'motivo'> & { motivo?: NonNullable<Cita['motivo']> };
export type ActualizarCitaDTO = Partial<Omit<Cita, 'id' | 'paciente'>>;
export type CambiarEstadoCitaDTO = { status: Exclude<EstadoCita, 'PROGRAMADA'> };
