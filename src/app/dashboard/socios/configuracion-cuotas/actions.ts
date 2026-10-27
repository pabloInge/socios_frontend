"use server";

import { fetchAPI } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/auth";
import {
  type ConfiguracionCuotaItem,
  type ModificarSocioFormData,
  type ModificarSepelioHastaFormData,
  type ModificarSepelioMasDeFormData,
  modificarSocioSchema,
  modificarSepelioHastaSchema,
  modificarSepelioMasDeSchema,
} from "./schema";

interface BackendConfiguracionCuota {
  id_TipoCuota: number;
  concepto: string;
  importe: number;
  edad: string;
  plan: string;
  ultimaModificacion?: string;
  fecha_ultimamodif?: string;
}

export async function obtenerConfiguracionCuotas(
  concepto?: string
): Promise<ConfiguracionCuotaItem[]> {
  const token = await getAuthToken();

  if (!token) return [];

  const queryParams = new URLSearchParams();
  if (concepto && concepto.trim().toLowerCase() !== "todos") {
    queryParams.set("Concepto", concepto.trim());
  }

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

  try {
    const raw = await fetchAPI<BackendConfiguracionCuota[]>(
      `/configuracion-cuotas${queryString}`,
      token
    );

    if (!Array.isArray(raw)) return [];

    return raw.map((item) => ({
      id_TipoCuota: item.id_TipoCuota,
      concepto: item.concepto,
      importe: item.importe,
      edad: item.edad,
      plan: item.plan,
      ultimaModificacion:
        item.ultimaModificacion || item.fecha_ultimamodif || new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function modificarImporteSocio(
  data: ModificarSocioFormData
): Promise<{ success: boolean; mensaje?: string }> {
  const parsed = modificarSocioSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      mensaje: parsed.error.issues[0]?.message || "Datos inválidos",
    };
  }

  const token = await getAuthToken();
  if (!token) return { success: false, mensaje: "No autenticado" };

  try {
    const res = await fetchAPI<{ mensaje: string }>(
      "/configuracion-cuotas/modificar-socio",
      token,
      {
        method: "PUT",
        body: JSON.stringify(parsed.data),
      }
    );
    return { success: true, mensaje: res?.mensaje };
  } catch (err: unknown) {
    const mensaje = err instanceof Error ? err.message : "Error al modificar la cuota";
    return { success: false, mensaje };
  }
}

export async function modificarSepelioConTope(
  data: ModificarSepelioHastaFormData
): Promise<{ success: boolean; mensaje?: string }> {
  const parsed = modificarSepelioHastaSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      mensaje: parsed.error.issues[0]?.message || "Datos inválidos",
    };
  }

  const token = await getAuthToken();
  if (!token) return { success: false, mensaje: "No autenticado" };

  try {
    const res = await fetchAPI<{ mensaje: string }>(
      "/configuracion-cuotas/modificar-sepelio-con-tope",
      token,
      {
        method: "PUT",
        body: JSON.stringify(parsed.data),
      }
    );
    return { success: true, mensaje: res?.mensaje };
  } catch (err: unknown) {
    const mensaje = err instanceof Error ? err.message : "Error al modificar la cuota";
    return { success: false, mensaje };
  }
}

export async function modificarSepelioSinTope(
  data: ModificarSepelioMasDeFormData
): Promise<{ success: boolean; mensaje?: string }> {
  const parsed = modificarSepelioMasDeSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      mensaje: parsed.error.issues[0]?.message || "Datos inválidos",
    };
  }

  const token = await getAuthToken();
  if (!token) return { success: false, mensaje: "No autenticado" };

  try {
    const res = await fetchAPI<{ mensaje: string }>(
      "/configuracion-cuotas/modificar-sepelio-sin-tope",
      token,
      {
        method: "PUT",
        body: JSON.stringify(parsed.data),
      }
    );
    return { success: true, mensaje: res?.mensaje };
  } catch (err: unknown) {
    const mensaje = err instanceof Error ? err.message : "Error al modificar la cuota";
    return { success: false, mensaje };
  }
}
