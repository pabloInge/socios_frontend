"use server";

import { fetchAPI } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/auth";
import { findCiudadIdByName } from "@/lib/ciudades";
import { findPrestacionIdByName, findPrestacionNameById } from "@/lib/prestaciones";
import {
  type ColaboradorListItem,
  type ColaboradorDetalle,
  type ColaboradorFormData,
  colaboradorSchema,
  bajaColaboradorSchema,
  normalizeContacts,
} from "./schema";

interface BackendColaboradorRaw {
  id_Colaborador?: number;
  id_Entidad?: number;
  idColaborador?: number;
  idEntidad?: number;
  tipoDocumento?: string;
  documento?: string;
  dni?: string | null;
  cuitCuil?: string | null;
  nombre?: string;
  apellido?: string;
  razonSocial?: string | null;
  sexo?: string;
  nacimiento?: string;
  fechaNacimiento?: string;
  prestacion?: string;
  idPrestacion?: number;
  estado?: string;
  ciudad?: string | { id_Ciudad?: number; nombre?: string };
  calle?: string;
  altura?: number | string;
  observacion?: string | null;
  observaciones?: string | null;
  telefonos?: string[];
  emails?: string[];
}

export async function obtenerColaboradores(
  busqueda?: string
): Promise<ColaboradorListItem[]> {
  const token = await getAuthToken();

  if (!token) return [];

  const queryParams = new URLSearchParams();
  if (busqueda && busqueda.trim()) {
    queryParams.set("busqueda", busqueda.trim());
  }

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

  try {
    const raw = await fetchAPI<BackendColaboradorRaw[]>(
      `/colaboradores/buscar${queryString}`,
      token
    );

    if (!Array.isArray(raw)) return [];

    return raw.map((item) => {
      const idRaw = item.id_Entidad ?? item.idEntidad ?? item.id_Colaborador ?? 0;
      const doc = item.documento || item.cuitCuil || item.dni || "";
      const tipoDoc = item.tipoDocumento || (doc.length > 8 ? "CUIT" : "DNI");
      const estadoNorm: "Activo" | "Inactivo" =
        item.estado?.toUpperCase() === "INACTIVO" ? "Inactivo" : "Activo";

      const prestacionNombre =
        item.prestacion || findPrestacionNameById(item.idPrestacion);

      return {
        id: String(idRaw),
        tipoDocumento: tipoDoc,
        documento: doc,
        nombre: item.nombre || "",
        apellido: item.apellido || "",
        razonSocial: item.razonSocial || undefined,
        prestacion: prestacionNombre,
        estado: estadoNorm,
        telefonos: item.telefonos || [],
        emails: item.emails || [],
      };
    });
  } catch {
    return [];
  }
}

export async function obtenerColaboradorDetalle(
  id: string
): Promise<ColaboradorDetalle | null> {
  const token = await getAuthToken();

  if (!token) return null;

  try {
    const raw = await fetchAPI<BackendColaboradorRaw>(
      `/colaboradores/${id}`,
      token
    );

    if (!raw) return null;

    const idRaw = raw.id_Entidad ?? raw.idEntidad ?? id;
    const doc = raw.documento || raw.cuitCuil || raw.dni || "";
    const tipoDoc = raw.tipoDocumento || (doc.length > 8 ? "CUIT" : "DNI");
    const estadoNorm: "Activo" | "Inactivo" =
      raw.estado?.toUpperCase() === "INACTIVO" ? "Inactivo" : "Activo";

    const ciudadNombre =
      typeof raw.ciudad === "object" && raw.ciudad !== null
        ? raw.ciudad.nombre || ""
        : typeof raw.ciudad === "string"
        ? raw.ciudad
        : "";

    const fechaRaw = raw.fechaNacimiento || raw.nacimiento || "";
    const prestacionNombre =
      raw.prestacion || findPrestacionNameById(raw.idPrestacion);

    return {
      id: String(idRaw),
      tipoDocumento: tipoDoc,
      documento: doc,
      nombre: raw.nombre || "",
      apellido: raw.apellido || "",
      razonSocial: raw.razonSocial || undefined,
      prestacion: prestacionNombre,
      estado: estadoNorm,
      fechaNacimiento: fechaRaw ? (fechaRaw.split("T")[0] ?? "") : "",
      ciudad: ciudadNombre,
      calle: raw.calle || "",
      altura: String(raw.altura ?? ""),
      observaciones: raw.observaciones || raw.observacion || undefined,
      telefonos: raw.telefonos || [],
      emails: raw.emails || [],
    };
  } catch {
    return null;
  }
}

export async function crearColaborador(
  data: ColaboradorFormData
): Promise<{ success: boolean; idColaborador?: number; mensaje?: string }> {
  const parsed = colaboradorSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      mensaje: parsed.error.issues[0]?.message || "Datos inválidos",
    };
  }

  const token = await getAuthToken();
  if (!token) return { success: false, mensaje: "No autenticado" };

  try {
    const payload = {
      tipoDocumento: parsed.data.tipoDocumento,
      documento: parsed.data.documento,
      nombre: parsed.data.nombre,
      apellido: parsed.data.apellido,
      razonSocial: parsed.data.razonSocial || undefined,
      fechaNacimiento: parsed.data.fechaNacimiento
        ? new Date(parsed.data.fechaNacimiento).toISOString()
        : undefined,
      idPrestacion: findPrestacionIdByName(parsed.data.prestacion),
      idCiudad: findCiudadIdByName(parsed.data.ciudad),
      calle: parsed.data.calle,
      altura: parseInt(parsed.data.altura, 10) || 0,
      observaciones: parsed.data.observaciones || undefined,
      telefonos: normalizeContacts(parsed.data.telefonos),
      emails: normalizeContacts(parsed.data.correos),
    };

    const res = await fetchAPI<{ idColaborador: number }>("/colaboradores/crear", token, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return { success: true, idColaborador: res?.idColaborador };
  } catch (err: unknown) {
    const mensaje = err instanceof Error ? err.message : "Error al dar de alta el colaborador";
    return { success: false, mensaje };
  }
}

export async function modificarColaborador(
  idEntidad: number,
  data: ColaboradorFormData
): Promise<{ success: boolean; mensaje?: string }> {
  const parsed = colaboradorSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      mensaje: parsed.error.issues[0]?.message || "Datos inválidos",
    };
  }

  const token = await getAuthToken();
  if (!token) return { success: false, mensaje: "No autenticado" };

  try {
    const payload = {
      idEntidad,
      nombre: parsed.data.nombre,
      apellido: parsed.data.apellido,
      razonSocial: parsed.data.razonSocial || undefined,
      fechaNacimiento: parsed.data.fechaNacimiento
        ? new Date(parsed.data.fechaNacimiento).toISOString()
        : undefined,
      idPrestacion: findPrestacionIdByName(parsed.data.prestacion),
      idCiudad: findCiudadIdByName(parsed.data.ciudad),
      calle: parsed.data.calle,
      altura: parseInt(parsed.data.altura, 10) || 0,
      observaciones: parsed.data.observaciones || undefined,
      telefonos: normalizeContacts(parsed.data.telefonos),
      emails: normalizeContacts(parsed.data.correos),
    };

    const res = await fetchAPI<{ mensaje: string }>("/colaboradores/modificar", token, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return { success: true, mensaje: res?.mensaje };
  } catch (err: unknown) {
    const mensaje = err instanceof Error ? err.message : "Error al modificar el colaborador";
    return { success: false, mensaje };
  }
}

export async function darDeBajaColaborador(
  idEntidadTipo: number,
  motivo: string
): Promise<{ success: boolean; mensaje?: string }> {
  const parsed = bajaColaboradorSchema.safeParse({ idEntidadTipo, motivo });
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
      `/colaboradores/baja/${idEntidadTipo}`,
      token,
      {
        method: "PUT",
        body: JSON.stringify({ motivo: parsed.data.motivo }),
      }
    );
    return { success: true, mensaje: res?.mensaje };
  } catch (err: unknown) {
    const mensaje = err instanceof Error ? err.message : "Error al dar de baja el colaborador";
    return { success: false, mensaje };
  }
}

export async function reactivarColaborador(
  idEntidad: number
): Promise<{ success: boolean; mensaje?: string }> {
  const token = await getAuthToken();
  if (!token) return { success: false, mensaje: "No autenticado" };

  try {
    const res = await fetchAPI<{ mensaje: string }>("/colaboradores/reactivar", token, {
      method: "POST",
      body: JSON.stringify({ idEntidad }),
    });
    return { success: true, mensaje: res?.mensaje };
  } catch (err: unknown) {
    const mensaje = err instanceof Error ? err.message : "Error al reactivar el colaborador";
    return { success: false, mensaje };
  }
}

interface BackendEntidadBusqueda {
  id_Entidad?: number;
  cuitCuil?: string;
  nombre?: string;
  apellido?: string;
  razonSocial?: string | null;
  sexo?: string;
  nacimiento?: string;
  fechaNacimiento?: string;
  ciudad?: { id_Ciudad?: number; nombre?: string } | string;
  calle?: string;
  altura?: number | string;
  observacion?: string | null;
  observaciones?: string | null;
}

export async function buscarColaboradorPorDocumento(
  documento: string
): Promise<Partial<ColaboradorFormData> | null> {
  const token = await getAuthToken();
  if (!token) return null;

  try {
    const raw = await fetchAPI<BackendEntidadBusqueda>(
      "/buscarentidad",
      token,
      {
        method: "GET",
        body: JSON.stringify({ dni: documento }),
      }
    );

    if (!raw) return null;

    const ciudadNombre =
      typeof raw.ciudad === "object" && raw.ciudad !== null
        ? raw.ciudad.nombre || ""
        : typeof raw.ciudad === "string"
        ? raw.ciudad
        : "";

    const fechaRaw = raw.fechaNacimiento || raw.nacimiento || "";

    return {
      documento,
      tipoDocumento: documento.length > 8 ? "CUIT" : "DNI",
      nombre: raw.nombre || "",
      apellido: raw.apellido || "",
      razonSocial: raw.razonSocial || undefined,
      ciudad: ciudadNombre,
      calle: raw.calle || "",
      altura: String(raw.altura ?? ""),
      fechaNacimiento: fechaRaw ? (fechaRaw.split("T")[0] ?? "") : "",
      observaciones: raw.observaciones || raw.observacion || undefined,
      prestacion: "Atención Médica",
      telefonos: [],
      correos: [],
    };
  } catch {
    return null;
  }
}
