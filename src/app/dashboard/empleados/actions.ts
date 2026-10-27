"use server";

import { fetchAPI } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/auth";
import { findCiudadIdByName } from "@/lib/ciudades";
import {
  type EmpleadoListItem,
  type EmpleadoDetalle,
  type EmpleadoFormData,
  empleadoSchema,
  bajaEmpleadoSchema,
  normalizeContacts,
} from "./schema";

interface BackendEmpleadoRaw {
  id_Entidad?: number;
  idEntidad?: number;
  id_EntidadTipo?: number;
  idEntidadTipo?: number;
  dni?: string | null;
  cuitCuil?: string | null;
  nombre?: string;
  apellido?: string;
  sexo?: string | null;
  nacimiento?: string;
  fechaNacimiento?: string;
  estado?: string;
  ciudad?: string | { id_Ciudad?: number; nombre?: string };
  calle?: string;
  altura?: number | string;
  observacion?: string | null;
  observaciones?: string | null;
  telefonos?: string[];
  emails?: string[];
}

export async function obtenerEmpleados(
  busqueda?: string
): Promise<EmpleadoListItem[]> {
  const token = await getAuthToken();

  if (!token) return [];

  const queryParams = new URLSearchParams();
  if (busqueda && busqueda.trim()) {
    queryParams.set("busqueda", busqueda.trim());
  }

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

  try {
    const raw = await fetchAPI<BackendEmpleadoRaw[]>(
      `/Empleados/buscar${queryString}`,
      token
    );

    if (!Array.isArray(raw)) return [];

    return raw.map((item) => {
      const idRaw = item.id_Entidad ?? item.idEntidad ?? 0;
      const idTipo = item.id_EntidadTipo ?? item.idEntidadTipo ?? idRaw;
      const doc = item.dni || item.cuitCuil || "";
      const estadoNorm: "Activo" | "Inactivo" =
        item.estado?.toUpperCase() === "INACTIVO" ? "Inactivo" : "Activo";

      return {
        id: String(idRaw),
        idEntidadTipo: idTipo,
        dni: doc,
        cuitCuil: item.cuitCuil || undefined,
        nombre: item.nombre || "",
        apellido: item.apellido || "",
        sexo: item.sexo || undefined,
        estado: estadoNorm,
        telefonos: item.telefonos || [],
        emails: item.emails || [],
      };
    });
  } catch {
    return [];
  }
}

export async function obtenerEmpleadoDetalle(
  id: string
): Promise<EmpleadoDetalle | null> {
  const token = await getAuthToken();

  if (!token) return null;

  try {
    const raw = await fetchAPI<BackendEmpleadoRaw>(
      `/Empleados/${id}`,
      token
    );

    if (!raw) return null;

    const idRaw = raw.id_Entidad ?? raw.idEntidad ?? id;
    const idTipo = raw.id_EntidadTipo ?? raw.idEntidadTipo ?? Number(idRaw);
    const doc = raw.dni || raw.cuitCuil || "";
    const estadoNorm: "Activo" | "Inactivo" =
      raw.estado?.toUpperCase() === "INACTIVO" ? "Inactivo" : "Activo";

    const ciudadNombre =
      typeof raw.ciudad === "object" && raw.ciudad !== null
        ? raw.ciudad.nombre || ""
        : typeof raw.ciudad === "string"
        ? raw.ciudad
        : "";

    const fechaRaw = raw.fechaNacimiento || raw.nacimiento || "";

    return {
      id: String(idRaw),
      idEntidadTipo: idTipo,
      dni: doc,
      cuitCuil: raw.cuitCuil || undefined,
      nombre: raw.nombre || "",
      apellido: raw.apellido || "",
      sexo: raw.sexo || undefined,
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

export async function crearEmpleado(
  data: EmpleadoFormData
): Promise<{ success: boolean; idEmpleado?: number; mensaje?: string }> {
  const parsed = empleadoSchema.safeParse(data);
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
      dni: parsed.data.dni,
      nombre: parsed.data.nombre,
      apellido: parsed.data.apellido,
      sexo: parsed.data.sexo || undefined,
      nacimiento: parsed.data.fechaNacimiento
        ? new Date(parsed.data.fechaNacimiento).toISOString()
        : undefined,
      idCiudad: findCiudadIdByName(parsed.data.ciudad),
      calle: parsed.data.calle,
      altura: parseInt(parsed.data.altura, 10) || 0,
      observaciones: parsed.data.observaciones || undefined,
      telefonos: normalizeContacts(parsed.data.telefonos),
      emails: normalizeContacts(parsed.data.correos),
    };

    const res = await fetchAPI<{ id?: number; mensaje?: string }>("/Empleados/alta", token, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return { success: true, idEmpleado: res?.id, mensaje: res?.mensaje };
  } catch (err: unknown) {
    const mensaje = err instanceof Error ? err.message : "Error al dar de alta el empleado";
    return { success: false, mensaje };
  }
}

export async function modificarEmpleado(
  idEntidad: number,
  data: EmpleadoFormData
): Promise<{ success: boolean; mensaje?: string }> {
  const parsed = empleadoSchema.safeParse(data);
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
      dni: parsed.data.dni,
      nombre: parsed.data.nombre,
      apellido: parsed.data.apellido,
      sexo: parsed.data.sexo || undefined,
      nacimiento: parsed.data.fechaNacimiento
        ? new Date(parsed.data.fechaNacimiento).toISOString()
        : undefined,
      idCiudad: findCiudadIdByName(parsed.data.ciudad),
      calle: parsed.data.calle,
      altura: parseInt(parsed.data.altura, 10) || 0,
      observaciones: parsed.data.observaciones || undefined,
      telefonos: normalizeContacts(parsed.data.telefonos),
      emails: normalizeContacts(parsed.data.correos),
    };

    const res = await fetchAPI<{ mensaje: string }>("/Empleados/modificar", token, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return { success: true, mensaje: res?.mensaje };
  } catch (err: unknown) {
    const mensaje = err instanceof Error ? err.message : "Error al modificar el empleado";
    return { success: false, mensaje };
  }
}

export async function darDeBajaEmpleado(
  idEntidadTipo: number,
  motivo: string
): Promise<{ success: boolean; mensaje?: string }> {
  const parsed = bajaEmpleadoSchema.safeParse({ idEntidadTipo, motivo });
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
      `/Empleados/baja/${idEntidadTipo}`,
      token,
      {
        method: "PUT",
        body: JSON.stringify({ motivo: parsed.data.motivo }),
      }
    );
    return { success: true, mensaje: res?.mensaje };
  } catch (err: unknown) {
    const mensaje = err instanceof Error ? err.message : "Error al dar de baja el empleado";
    return { success: false, mensaje };
  }
}

interface BackendEntidadBusqueda {
  id_Entidad?: number;
  dni?: string;
  cuitCuil?: string;
  nombre?: string;
  apellido?: string;
  sexo?: string;
  nacimiento?: string;
  fechaNacimiento?: string;
  ciudad?: { id_Ciudad?: number; nombre?: string } | string;
  calle?: string;
  altura?: number | string;
  observacion?: string | null;
  observaciones?: string | null;
}

export async function buscarEmpleadoPorDocumento(
  dni: string
): Promise<Partial<EmpleadoFormData> | null> {
  const token = await getAuthToken();
  if (!token) return null;

  try {
    const raw = await fetchAPI<BackendEntidadBusqueda>(
      "/buscarentidad",
      token,
      {
        method: "GET",
        body: JSON.stringify({ dni }),
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
      dni,
      nombre: raw.nombre || "",
      apellido: raw.apellido || "",
      sexo: raw.sexo || "",
      ciudad: ciudadNombre,
      calle: raw.calle || "",
      altura: String(raw.altura ?? ""),
      fechaNacimiento: fechaRaw ? (fechaRaw.split("T")[0] ?? "") : "",
      observaciones: raw.observaciones || raw.observacion || undefined,
      telefonos: [],
      correos: [],
    };
  } catch {
    return null;
  }
}
