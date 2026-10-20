import { z } from 'zod';

// Reglas para los datos de la cita.
export const citaSchema = z.object({
  pacienteNombre: z.string().trim().min(3, 'Escribe al menos 3 caracteres.'),
  medicoId: z.string().trim().min(1, 'Selecciona un médico.'),
  fecha: z.iso.date('Escribe una fecha válida con formato YYYY-MM-DD.').refine(
    fecha => fecha >= new Date().toISOString().split('T')[0],
    'La fecha no puede ser pasada.',
  ),
  hora: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Escribe una hora válida entre 00:00 y 23:59.'),
  motivo: z.string().trim().min(10, 'Escribe al menos 10 caracteres.').max(500, 'El motivo no puede superar 500 caracteres.'),
  urgencia: z.enum(['baja', 'media', 'alta', 'critica'], { error: 'Selecciona una urgencia válida.' }),
});

// Crear el tipo a partir del esquema de Zod.
export type CitaFormData = z.infer<typeof citaSchema>;
