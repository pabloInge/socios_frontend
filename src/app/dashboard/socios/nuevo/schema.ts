import { z } from "zod";

export const socioSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 letras"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 letras"),
  tipoDocumento: z.enum(["DNI", "CUIT"]),
  nroDocumento: z.string().regex(/^\d+$/, "El documento solo puede contener números").min(7, "El documento debe tener al menos 7 dígitos"),
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

/**
 * Un teléfono/correo del form puede llegar como string plano o como
 * { value } (según venga de useFieldArray). Este tipo describe ambas formas.
 */
export type ContactField = string | { value: string };

/**
 * Normaliza un array de contactos (teléfonos o correos) a strings planos,
 * descartando vacíos. Único punto de verdad para esta conversión: la usan
 * el alta/edición (onSubmit) y el dev-store.
 */
export function normalizeContacts(values: ContactField[] | undefined): string[] {
  return (values ?? [])
    .map((v) => (typeof v === "string" ? v : v.value))
    .filter(Boolean);
}
