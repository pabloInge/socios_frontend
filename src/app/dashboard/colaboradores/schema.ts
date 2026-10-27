import { z } from "zod";

export interface ColaboradorListItem {
  id: string;
  tipoDocumento: string;
  documento: string;
  nombre: string;
  apellido: string;
  razonSocial?: string;
  prestacion: string;
  estado: "Activo" | "Inactivo";
  telefonos: string[];
  emails: string[];
}

export interface ColaboradorDetalle {
  id: string;
  tipoDocumento: string;
  documento: string;
  nombre: string;
  apellido: string;
  razonSocial?: string;
  prestacion: string;
  estado: "Activo" | "Inactivo";
  fechaNacimiento: string;
  ciudad: string;
  calle: string;
  altura: string;
  observaciones?: string;
  telefonos: string[];
  emails: string[];
}

export type ContactField = string | { value: string };

export function normalizeContacts(items?: ContactField[]): string[] {
  if (!items) return [];
  return items
    .map((item) => (typeof item === "string" ? item.trim() : item.value.trim()))
    .filter((str) => str.length > 0);
}

export const colaboradorSchema = z.object({
  tipoDocumento: z.enum(["DNI", "CUIT"], {
    message: "El tipo de documento debe ser 'DNI' o 'CUIT'",
  }),
  documento: z
    .string()
    .trim()
    .min(1, "El documento es obligatorio")
    .regex(/^\d{7,11}$/, "El documento debe tener entre 7 y 11 dígitos"),
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(150, "Máximo 150 caracteres"),
  apellido: z
    .string()
    .trim()
    .min(3, "El apellido debe tener al menos 3 caracteres")
    .max(150, "Máximo 150 caracteres"),
  razonSocial: z.string().trim().max(250, "Máximo 250 caracteres").optional(),
  prestacion: z.string().min(1, "El servicio prestado es obligatorio"),
  fechaNacimiento: z.string().optional(),
  ciudad: z.string().min(1, "La ciudad es obligatoria"),
  calle: z.string().min(1, "La calle es obligatoria"),
  altura: z.string().min(1, "La altura es obligatoria"),
  observaciones: z.string().optional(),
  telefonos: z
    .array(z.union([z.string(), z.object({ value: z.string() })]))
    .min(1, "Debe ingresar al menos un teléfono"),
  correos: z
    .array(
      z.union([
        z.string(),
        z.object({ value: z.string().email("Correo inválido") }),
      ])
    )
    .optional(),
});

export type ColaboradorFormData = z.infer<typeof colaboradorSchema>;

export const bajaColaboradorSchema = z.object({
  idEntidadTipo: z.number().int().positive("El id es obligatorio"),
  motivo: z.string().trim().min(3, "El motivo debe tener al menos 3 caracteres"),
});

export type BajaColaboradorFormData = z.infer<typeof bajaColaboradorSchema>;
