"use server";

import { fetchAPI } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/auth";
import { type EntidadListItem, type EntidadDetalle } from "./schema";

interface BackendEntidadRaw {
  id_Entidad?: number;
  idEntidad?: number;
  id?: number | string;
  cuitCuil?: string;
  nombre?: string;
  apellido?: string;
  razonSocial?: string | null;
  sexo?: string;
  nacimiento?: string;
  fechaNacimiento?: string;
  ciudad?: string | { id_Ciudad?: number; nombre?: string };
  calle?: string;
  altura?: number | string;
  observacion?: string | null;
  observaciones?: string | null;
}

export async function buscarEntidades(
  filtro?: string
): Promise<EntidadListItem[]> {
  const token = await getAuthToken();

  if (!token) return [];

  const queryParams = new URLSearchParams();
  if (filtro) queryParams.set("Busqueda", filtro);

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

  try {
    const raw = await fetchAPI<BackendEntidadRaw[]>(
      `/buscarentidad/buscar${queryString}`,
      token
    );

    if (!Array.isArray(raw)) return [];

    return raw.map((item) => {
      const idRaw = item.id_Entidad ?? item.idEntidad ?? item.id ?? "";
      const fechaRaw = item.fechaNacimiento || item.nacimiento || "";
      const isJuridica = Boolean(item.razonSocial && item.razonSocial.trim());

      return {
        id: String(idRaw),
        cuitCuil: item.cuitCuil || "",
        nombre: item.nombre || "",
        apellido: item.apellido || "",
        razonSocial: item.razonSocial || null,
        sexo: item.sexo || "-",
        fechaNacimiento: fechaRaw ? (fechaRaw.split("T")[0] ?? "") : "",
        tipo: isJuridica ? "Jurídica" : "Física",
      };
    });
  } catch {
    return [];
  }
}

export async function obtenerEntidadPorDni(
  dni: string
): Promise<EntidadDetalle | null> {
  const token = await getAuthToken();

  if (!token || !dni) return null;

  try {
    const raw = await fetchAPI<BackendEntidadRaw>(
      "/buscarentidad",
      token,
      {
        method: "GET",
        body: JSON.stringify({ dni }),
      }
    );

    if (!raw) return null;

    const idRaw = raw.id_Entidad ?? raw.idEntidad ?? raw.id ?? "";
    const fechaRaw = raw.fechaNacimiento || raw.nacimiento || "";
    const isJuridica = Boolean(raw.razonSocial && raw.razonSocial.trim());

    const ciudadNombre =
      typeof raw.ciudad === "object" && raw.ciudad !== null
        ? raw.ciudad.nombre || ""
        : typeof raw.ciudad === "string"
        ? raw.ciudad
        : "";

    return {
      id: String(idRaw),
      cuitCuil: raw.cuitCuil || "",
      nombre: raw.nombre || "",
      apellido: raw.apellido || "",
      razonSocial: raw.razonSocial || null,
      sexo: raw.sexo || "-",
      fechaNacimiento: fechaRaw ? (fechaRaw.split("T")[0] ?? "") : "",
      ciudad: ciudadNombre,
      calle: raw.calle || "",
      altura: String(raw.altura ?? ""),
      observaciones: raw.observaciones || raw.observacion || undefined,
      tipo: isJuridica ? "Jurídica" : "Física",
    };
  } catch {
    return null;
  }
}
