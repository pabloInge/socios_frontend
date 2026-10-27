import { z } from "zod";

export interface ConfiguracionCuotaItem {
  id_TipoCuota: number;
  concepto: string;
  importe: number;
  edad: string;
  plan: string;
  ultimaModificacion: string;
}

export const modificarSocioSchema = z.object({
  id_TipoCuota: z.number().int().positive("El id del tipo de cuota es obligatorio"),
  importe: z
    .number({ message: "El importe debe ser un número válido" })
    .min(0, "El importe no puede ser negativo"),
});

export type ModificarSocioFormData = z.infer<typeof modificarSocioSchema>;

export const modificarSepelioHastaSchema = z.object({
  id_TipoCuota: z.number().int().positive("El id del tipo de cuota es obligatorio"),
  importe: z
    .number({ message: "El importe debe ser un número válido" })
    .min(0, "El importe no puede ser negativo"),
  edadTope: z
    .number({ message: "La edad debe ser un número entero" })
    .int()
    .positive("El tope de edad debe ser mayor a cero"),
});

export type ModificarSepelioHastaFormData = z.infer<typeof modificarSepelioHastaSchema>;

export const modificarSepelioMasDeSchema = z.object({
  id_TipoCuota: z.number().int().positive("El id del tipo de cuota es obligatorio"),
  importe: z
    .number({ message: "El importe debe ser un número válido" })
    .min(0, "El importe no puede ser negativo"),
});

export type ModificarSepelioMasDeFormData = z.infer<typeof modificarSepelioMasDeSchema>;
