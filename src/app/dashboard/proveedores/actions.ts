"use server";

import { fetchAPI } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/auth";
import {
  type ProveedorListItem,
  type ProveedorDetalle,
  type ProveedorFormData,
  normalizeContacts,
} from "./schema";
import { findCiudadIdByName } from "@/lib/ciudades";

interface BackendProveedorItem {
  id_Proveedor?: number;
  idProveedor?: number;
  id?: number | string;
  cuitCuil?: string;
  razonSocial?: string;
  nombre?: string;
  prestacion?: string;
  servicio?: string;
  estado?: string;
  telefonos?: string[];
  emails?: string[];
}

interface BackendProveedorDetalle extends BackendProveedorItem {
  fechaNacimiento?: string;
  nacimiento?: string;
  ciudad?: string | { id_Ciudad?: number; nombre?: string };
  calle?: string;
  altura?: number | string;
  observaciones?: string | null;
  observacion?: string | null;
}

export async function obtenerProveedores(filtros?: {
  filtro?: string;
  cuitCuil?: string;
  estado?: string;
}): Promise<ProveedorListItem[]> {
  const token = await getAuthToken();

  if (!token) return [];

  const queryParams = new URLSearchParams();
  if (filtros?.filtro) queryParams.set("Busqueda", filtros.filtro);
  if (filtros?.cuitCuil) queryParams.set("CuitCuil", filtros.cuitCuil);
  if (filtros?.estado && filtros.estado !== "Todos") {
    queryParams.set("estado", filtros.estado);
    if (filtros.estado === "Inactivo") {
      queryParams.set("IncluirInactivos", "true");
    }
  } else if (filtros?.estado === "Todos") {
    queryParams.set("IncluirInactivos", "true");
  }

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

  try {
    const raw = await fetchAPI<BackendProveedorItem[]>(
      `/proveedores${queryString}`,
      token
    );

    if (!Array.isArray(raw)) return [];

    return raw.map((item) => {
      const idRaw = item.id_Proveedor ?? item.idProveedor ?? item.id;
      const estadoNorm: "Activo" | "Inactivo" =
        item.estado?.toUpperCase() === "ACTIVO" ? "Activo" : "Inactivo";

      return {
        id: String(idRaw ?? ""),
        cuitCuil: item.cuitCuil || "",
        razonSocial: item.razonSocial || item.nombre || "",
        prestacion: item.prestacion || item.servicio || "",
        estado: estadoNorm,
        telefonos: item.telefonos || [],
        emails: item.emails || [],
      };
    });
  } catch {
    return [];
  }
}

export async function obtenerProveedorDetalle(
  id: string
): Promise<ProveedorDetalle | null> {
  const token = await getAuthToken();

  if (!token) return null;

  try {
    const raw = await fetchAPI<BackendProveedorDetalle>(
      `/proveedores/${id}`,
      token
    );

    if (!raw) return null;

    const idRaw = raw.id_Proveedor ?? raw.idProveedor ?? raw.id ?? id;
    const estadoNorm: "Activo" | "Inactivo" =
      raw.estado?.toUpperCase() === "ACTIVO" ? "Activo" : "Inactivo";

    const ciudadNombre =
      typeof raw.ciudad === "object" && raw.ciudad !== null
        ? raw.ciudad.nombre || ""
        : typeof raw.ciudad === "string"
        ? raw.ciudad
        : "";

    const fechaRaw = raw.fechaNacimiento || raw.nacimiento || "";

    return {
      id: String(idRaw),
      cuitCuil: raw.cuitCuil || "",
      razonSocial: raw.razonSocial || raw.nombre || "",
      prestacion: raw.prestacion || raw.servicio || "",
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

export async function crearProveedor(
  data: ProveedorFormData
): Promise<{ idProveedor: number } | null> {
  const token = await getAuthToken();

  if (!token) return null;

  const payload = {
    dni: data.cuitCuil,
    razonSocial: data.razonSocial,
    prestacion: data.prestacion,
    fechaNacimiento: data.fechaNacimiento,
    idCiudad: findCiudadIdByName(data.ciudad),
    calle: data.calle,
    altura: parseInt(data.altura, 10) || 0,
    observaciones: data.observaciones || undefined,
    telefonos: normalizeContacts(data.telefonos),
    emails: normalizeContacts(data.correos),
  };

  return await fetchAPI<{ idProveedor: number }>("/proveedores/crear", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function actualizarProveedor(
  id: string,
  data: ProveedorFormData
): Promise<void> {
  const token = await getAuthToken();

  if (!token) return;

  const payload = {
    id_Proveedor: Number(id),
    razonSocial: data.razonSocial,
    prestacion: data.prestacion,
    idCiudad: findCiudadIdByName(data.ciudad),
    calle: data.calle,
    altura: parseInt(data.altura, 10) || 0,
    observaciones: data.observaciones || undefined,
    telefonos: normalizeContacts(data.telefonos),
    emails: normalizeContacts(data.correos),
  };

  await fetchAPI("/proveedores/modificar", token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function darDeBajaProveedor(id: string): Promise<boolean> {
  const token = await getAuthToken();

  if (!token) return false;

  try {
    await fetchAPI("/proveedores/baja", token, {
      method: "POST",
      body: JSON.stringify({ idProveedor: Number(id), id_Proveedor: Number(id) }),
    });
    return true;
  } catch {
    return false;
  }
}

export async function reactivarProveedor(id: string): Promise<boolean> {
  const token = await getAuthToken();

  if (!token) return false;

  try {
    await fetchAPI("/proveedores/reactivar", token, {
      method: "POST",
      body: JSON.stringify({ idProveedor: Number(id), id_Proveedor: Number(id) }),
    });
    return true;
  } catch {
    return false;
  }
}

export async function eliminarProveedor(id: string): Promise<boolean> {
  const token = await getAuthToken();

  if (!token) return false;

  try {
    await fetchAPI(`/proveedores/${id}`, token, {
      method: "DELETE",
      body: JSON.stringify({ idProveedor: Number(id), id_Proveedor: Number(id) }),
    });
    return true;
  } catch {
    return false;
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

export async function buscarProveedorPorDocumento(
  cuitCuil: string
): Promise<ProveedorFormData | null> {
  const token = await getAuthToken();

  if (!token) return null;

  try {
    const raw = await fetchAPI<BackendEntidadBusqueda | ProveedorFormData>(
      "/buscarentidad",
      token,
      {
        method: "GET",
        body: JSON.stringify({ dni: cuitCuil }),
      }
    );

    if (!raw) return null;

    if ("prestacion" in raw && "razonSocial" in raw) {
      return raw as ProveedorFormData;
    }

    const entidad = raw as BackendEntidadBusqueda;
    const ciudadNombre =
      typeof entidad.ciudad === "object" && entidad.ciudad !== null
        ? entidad.ciudad.nombre || ""
        : typeof entidad.ciudad === "string"
        ? entidad.ciudad
        : "";

    const fechaRaw = entidad.fechaNacimiento || entidad.nacimiento || "";
    const razonSocialCalculada =
      entidad.razonSocial ||
      (entidad.nombre && entidad.apellido
        ? `${entidad.apellido}, ${entidad.nombre}`
        : entidad.nombre || "");

    return {
      cuitCuil,
      razonSocial: razonSocialCalculada,
      prestacion: "",
      fechaNacimiento: fechaRaw ? (fechaRaw.split("T")[0] ?? "") : "",
      ciudad: ciudadNombre,
      calle: entidad.calle || "",
      altura: String(entidad.altura ?? ""),
      observaciones: entidad.observaciones || entidad.observacion || undefined,
      telefonos: [],
      correos: [],
    };
  } catch {
    return null;
  }
}
