import { z } from "zod";

export const citaSchema = z
  .object({
    pacienteId: z.string().regex(/^[1-9]\d*$/, "Selecciona un paciente."),
    medicoId: z.string().regex(/^[1-9]\d*$/, "Selecciona un médico."),
    fecha: z.iso.date("Escribe una fecha válida."),
    hora: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Escribe una hora válida."),
    motivo: z
      .string()
      .trim()
      .min(10, "Escribe al menos 10 caracteres.")
      .max(500, "Máximo 500 caracteres."),
  })
  .refine(
    (datos) =>
      new Date(`${datos.fecha}T${datos.hora}:00`).getTime() > Date.now(),
    {
      message: "La cita debe tener una fecha y hora futuras.",
      path: ["hora"],
    },
  );
export type CitaFormData = z.infer<typeof citaSchema>;
