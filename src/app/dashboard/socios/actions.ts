"use server";

import { fetchAPI } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/auth";
import { findCiudadIdByName } from "@/lib/ciudades";
import { findObraSocialIdByName } from "@/lib/obras-sociales";
import type { Codeudor } from "@/app/dashboard/socios/nuevo/schema";

export interface SocioFiltroDto {
  busqueda?: string;
  dni?: string;
  incluirInactivos?: boolean;
}

export interface SocioListItem {
  id: string;
  nombre: string;
  apellido: string;
  nroDocumento: string;
  obraSocial: string | null;
  plan: string;
  estado: "Activo" | "Baja";
}

export interface SocioDetalle {
  id: string;
  nombre: string;
  apellido: string;
  nroDocumento: string;
  fechaNacimiento: string;
  sexo?: string;
  ciudad: string;
  calle: string;
  altura: string;
  fechaAlta: string;
  fechaBaja?: string;
  obraSocial?: string;
  nroAfiliadoObraSocial?: string;
  plan: string;
  sepelio?: string;
  cobrador: string;
  observaciones?: string;
  telefonos: string[];
  correos: string[];
  codeudores?: Codeudor[];
}

export interface BackendSocioListItem {
  idSocio?: number;
  id?: string;
  nombre: string;
  apellido: string;
  dni?: string;
  nroDocumento?: string;
  estado?: string;
  obraSocial?: string | null;
  plan?: string;
}

export interface BackendSocioDetalle {
  idSocio?: number;
  id?: string;
  tipoDocumento?: string;
  dni?: string;
  nroDocumento?: string;
  nombre: string;
  apellido: string;
  fechaNacimiento?: string;
  sexo?: string;
  idCiudad?: number;
  ciudad?: string;
  calle?: string;
  altura?: number | string;
  observaciones?: string | null;
  estado?: string;
  fechaAlta?: string;
  fechaBaja?: string | null;
  idObraSocial?: number;
  obraSocial?: string | null;
  numeroAfiliado?: string;
  nroAfiliadoObraSocial?: string;
  plan?: string;
  sepelio?: string;
  cobrador?: string;
  telefonos?: string[];
  emails?: string[];
  correos?: string[];
  codeudores?: Codeudor[];
}

export async function obtenerSocios(filtro?: SocioFiltroDto): Promise<SocioListItem[]> {
  const token = await getAuthToken();

  if (!token) {
    return [];
  }

  try {
    const raw = await fetchAPI<BackendSocioListItem[]>("/socios", token, {
      method: "GET",
      body: JSON.stringify(filtro || {}),
    });
    if (!Array.isArray(raw)) return [];
    return raw.map((s) => {
      const isBackendFormat = s.idSocio !== undefined;
      const estadoNormalizado =
        (s.estado || "").toUpperCase() === "ACTIVO" || (s.estado || "").toLowerCase() === "activo"
          ? "Activo"
          : "Baja";
      return {
        id: isBackendFormat ? String(s.idSocio) : String(s.id || ""),
        nombre: s.nombre,
        apellido: s.apellido,
        nroDocumento: s.dni || s.nroDocumento || "",
        obraSocial: s.obraSocial ?? null,
        plan: s.plan ?? "",
        estado: estadoNormalizado,
      };
    });
  } catch {
    return [];
  }
}

export async function obtenerSocioDetalle(id: string): Promise<SocioDetalle | null> {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  try {
    const raw = await fetchAPI<BackendSocioDetalle>(`/socios/${id}`, token);
    if (!raw) return null;
    return {
      id: raw.idSocio !== undefined ? String(raw.idSocio) : (raw.id ? String(raw.id) : id),
      nombre: raw.nombre,
      apellido: raw.apellido,
      nroDocumento: raw.dni || raw.nroDocumento || "",
      fechaNacimiento: raw.fechaNacimiento ? (raw.fechaNacimiento.split("T")[0] ?? "") : "",
      sexo: raw.sexo || "",
      ciudad: raw.ciudad || "",
      calle: raw.calle || "",
      altura: String(raw.altura ?? ""),
      fechaAlta: raw.fechaAlta ? (raw.fechaAlta.split("T")[0] ?? "") : "",
      fechaBaja: raw.fechaBaja ? (raw.fechaBaja.split("T")[0] ?? undefined) : undefined,
      obraSocial: raw.obraSocial || undefined,
      nroAfiliadoObraSocial: raw.numeroAfiliado || raw.nroAfiliadoObraSocial || undefined,
      plan: raw.plan || "",
      sepelio: raw.sepelio || "NO",
      cobrador: raw.cobrador || "NO",
      observaciones: raw.observaciones || undefined,
      telefonos: raw.telefonos || [],
      correos: raw.emails || raw.correos || [],
      codeudores: raw.codeudores || [],
    };
  } catch {
    return null;
  }
}

export async function eliminarSocio(
  id: string,
  motivo: "RENUNCIA" | "MORA" | "FALLECIMIENTO" = "RENUNCIA"
): Promise<boolean> {
  const token = await getAuthToken();

  if (!token) return false;

  try {
    await fetchAPI("/socios/baja", token, {
      method: "POST",
      body: JSON.stringify({ idSocio: Number(id), motivo }),
    });
    return true;
  } catch {
    return false;
  }
}

export async function reactivarSocio(id: string): Promise<boolean> {
  const token = await getAuthToken();

  if (!token) return false;

  try {
    await fetchAPI(`/socios/${id}`, token, {
      method: "PATCH",
      body: JSON.stringify({ fechaBaja: null }),
    });
    return true;
  } catch {
    return false;
  }
}

export interface SocioModificarData {
  ciudad: string;
  calle: string;
  altura: string | number;
  observaciones?: string;
  obraSocial?: string;
  nroAfiliadoObraSocial?: string;
  plan?: string;
  sepelio?: string;
  cobrador?: string;
  telefonos: (string | { value: string })[];
  correos?: (string | { value: string })[];
}

export async function modificarSocio(
  id: string,
  data: SocioModificarData
): Promise<{ success: boolean; mensaje?: string }> {
  const token = await getAuthToken();

  if (!token) {
    return { success: false, mensaje: "No autenticado" };
  }

  try {
    const payload = {
      idSocio: Number(id),
      idCiudad: findCiudadIdByName(data.ciudad),
      calle: data.calle,
      altura: parseInt(String(data.altura), 10) || 0,
      observaciones: data.observaciones || undefined,
      idObraSocial: findObraSocialIdByName(data.obraSocial),
      numeroAfiliado: data.nroAfiliadoObraSocial || undefined,
      plan: data.plan || undefined,
      sepelio: data.sepelio || undefined,
      cobrador: data.cobrador || undefined,
      telefonos: (data.telefonos || [])
        .map((t) => (typeof t === "string" ? t.trim() : t.value.trim()))
        .filter(Boolean),
      emails: (data.correos || [])
        .map((c) => (typeof c === "string" ? c.trim() : c.value.trim()))
        .filter(Boolean),
    };

    const res = await fetchAPI<{ mensaje: string }>("/socios/modificar", token, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return { success: true, mensaje: res?.mensaje || "Socio modificado correctamente." };
  } catch (err: unknown) {
    const mensaje = err instanceof Error ? err.message : "Error al modificar socio";
    return { success: false, mensaje };
  }
}
