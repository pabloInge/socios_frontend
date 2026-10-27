import { z } from "zod";

export interface NichoSocio {
  id: string;
  nombre: string;
  apellido: string;
}

export interface NichoItem {
  id: string;
  nroNicho: string;
  sector: string;
  ocupado: boolean;
  conLapida: boolean;
  valorNicho: number;
  valorLapida: number;
  cuotas: number;
  interes: number;
  socio: NichoSocio | null;
}

export interface NichoFiltros {
  busqueda?: string;
  sectorNumero?: string;
  ocupado?: boolean;
}

export interface SocioAsignableNicho {
  idSocio: number;
  idEntidad: number;
  nombre: string;
  apellido: string;
  dni: string;
}

export const crearNichoSchema = z.object({
  sector: z
    .string()
    .trim()
    .min(1, "El sector es obligatorio.")
    .max(100, "El sector no puede superar los 100 caracteres."),
  nroNicho: z
    .string()
    .trim()
    .min(1, "El número de nicho es obligatorio.")
    .max(50, "El número de nicho no puede superar los 50 caracteres."),
});

export type CrearNichoFormData = z.infer<typeof crearNichoSchema>;

export const asignarNichoSchema = z
  .object({
    idNicho: z.number().int().positive("El id del nicho es obligatorio."),
    idEntidad: z
      .number({ message: "Debe seleccionar un socio titular." })
      .int()
      .positive("Debe seleccionar un socio titular."),
    valorTotal: z
      .number({ message: "El valor del nicho debe ser un número válido." })
      .min(0, "El valor total no puede ser negativo."),
    cuotas: z
      .number({ message: "La cantidad de cuotas debe ser un número entero." })
      .int()
      .min(1, "La cantidad de cuotas debe ser al menos 1."),
    interesPorCuota: z
      .number({ message: "El interés por cuota debe ser un número válido." })
      .min(0, "El interés no puede ser negativo."),
    conLapida: z.enum(["SI", "NO"], {
      message: "Debe indicar si el nicho lleva lápida ('SI' o 'NO').",
    }),
    valorLapida: z
      .number({ message: "El valor de la lápida debe ser un número válido." })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.conLapida === "SI") {
        return typeof data.valorLapida === "number" && data.valorLapida > 0;
      }
      return true;
    },
    {
      message: "El valor de la lápida es obligatorio y debe ser mayor a 0 cuando lleva lápida.",
      path: ["valorLapida"],
    }
  );

export type AsignarNichoFormData = z.infer<typeof asignarNichoSchema>;

export const bajaNichoSchema = z.object({
  idNicho: z.number().int().positive("El id del nicho es obligatorio."),
});

export type BajaNichoFormData = z.infer<typeof bajaNichoSchema>;
