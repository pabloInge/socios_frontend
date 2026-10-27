import { z } from "zod";

export interface EmpleadoListItem {
  id: string;
  idEntidadTipo?: number;
  dni: string;
  cuitCuil?: string;
  nombre: string;
  apellido: string;
  sexo?: string;
  estado: "Activo" | "Inactivo";
  telefonos: string[];
  emails: string[];
}

export interface EmpleadoDetalle {
  id: string;
  idEntidadTipo?: number;
  dni: string;
  cuitCuil?: string;
  nombre: string;
  apellido: string;
  sexo?: string;
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

export function contactValue(item: ContactField): string {
  return typeof item === "string" ? item.trim() : item.value.trim();
}

export function normalizeContacts(items?: ContactField[]): string[] {
  if (!items) return [];
  return items
    .map(contactValue)
    .filter((str) => str.length > 0);
}

export const empleadoSchema = z.object({
  dni: z
    .string()
    .trim()
    .min(1, "El DNI es obligatorio")
    .regex(/^\d{7,8}$/, "El DNI debe tener 7 u 8 dígitos"),
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
  sexo: z.string().optional(),
  fechaNacimiento: z.string().min(1, "La fecha de nacimiento es obligatoria"),
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

export type EmpleadoFormData = z.infer<typeof empleadoSchema>;

export const bajaEmpleadoSchema = z.object({
  idEntidadTipo: z.number().int().positive("El id es obligatorio"),
  motivo: z.string().trim().min(3, "El motivo debe tener al menos 3 caracteres"),
});

export type BajaEmpleadoFormData = z.infer<typeof bajaEmpleadoSchema>;
