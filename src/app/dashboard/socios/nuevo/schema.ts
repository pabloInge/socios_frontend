import { z } from "zod";

export const socioSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 letras"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 letras"),
  dni: z.string().regex(/^\d+$/, "El DNI solo puede contener números").min(7, "DNI inválido"),
  fechaNacimiento: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  ciudad: z.string().min(1, "La ciudad es obligatoria"),
  calle: z.string().min(1, "La calle es obligatoria"),
  altura: z.string().min(1, "La altura es obligatoria"),
  fechaAlta: z.string().min(1, "La fecha de alta es obligatoria"),
  fechaBaja: z.string().optional(),
  obraSocial: z.string().optional(),
  plan: z.string().min(1, "El plan es obligatorio"),
  sepelio: z.string().optional(),
  cobrador: z.string().min(1, "El cobrador es obligatorio"),
  telefonos: z.array(z.union([z.string(), z.object({ value: z.string() })])).optional(),
  correos: z.array(z.union([z.string(), z.object({ value: z.string().email("Correo inválido") })])).optional(),
});

export type SocioFormData = z.infer<typeof socioSchema>;
