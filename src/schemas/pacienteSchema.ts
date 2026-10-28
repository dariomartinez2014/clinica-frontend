import { z } from "zod";

export const pacienteSchema = z.object({
  nombre: z.string().trim().min(1, "Escribe el nombre.").max(100),
  apellido: z.string().trim().min(1, "Escribe el apellido.").max(100),
  email: z.email("Escribe un correo válido.").trim().toLowerCase(),
  telefono: z.string().trim().max(30, "Máximo 30 caracteres."),
  fechaNacimiento: z.iso
    .date("Escribe una fecha válida.")
    .refine(
      (fecha) =>
        fecha <=
        new Intl.DateTimeFormat("en-CA", {
          timeZone: "America/Guatemala",
        }).format(new Date()),
      "La fecha de nacimiento no puede estar en el futuro.",
    ),
});
export type PacienteFormData = z.infer<typeof pacienteSchema>;
