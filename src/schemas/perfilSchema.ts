import { z } from "zod";

export const perfilSchema = z.object({
  nombre: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().trim().email("Ingresa un email válido"),
  // Un input opcional vacío entrega "", no undefined.
  telefono: z.union([
    z.literal(""),
    z.string().regex(/^\d{8,15}$/, "Ingresa un teléfono válido (8 a 15 dígitos)"),
  ]).optional(),
});
export type PerfilFormData = z.infer<typeof perfilSchema>;
