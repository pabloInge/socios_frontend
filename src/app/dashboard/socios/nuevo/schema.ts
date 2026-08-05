import { z } from "zod";

export const socioSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 letras"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 letras"),
  nroDocumento: z.string().regex(/^\d+$/, "El documento solo puede contener números").min(7, "El documento debe tener al menos 7 dígitos"),
  fechaNacimiento: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  sexo: z.string().min(1, "El sexo es obligatorio"),
  ciudad: z.string().min(1, "La ciudad es obligatoria"),
  calle: z.string().min(1, "La calle es obligatoria"),
  altura: z.string().min(1, "La altura es obligatoria"),
  fechaAlta: z.string().min(1, "La fecha de alta es obligatoria"),
  fechaBaja: z.string().optional(),
  obraSocial: z.string().optional(),
  nroAfiliadoObraSocial: z.string().optional(),
  plan: z.string().min(1, "El plan es obligatorio"),
  sepelio: z.string().optional(),
  cobrador: z.string().min(1, "El cobrador es obligatorio"),
  observaciones: z.string().optional(),
  telefonos: z.array(z.union([z.string(), z.object({ value: z.string() })])).optional(),
  correos: z.array(z.union([z.string(), z.object({ value: z.string().email("Correo inválido") })])).optional(),
});

export type SocioFormData = z.infer<typeof socioSchema>;

export type ContactField = string | { value: string };

export function contactValue(field: ContactField): string {
  return typeof field === "string" ? field : field.value;
}

export function normalizeContacts(values: ContactField[] | undefined): string[] {
  return (values ?? [])
    .map(contactValue)
    .filter(Boolean);
}
