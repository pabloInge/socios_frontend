"use server";

import { cookies } from "next/headers";
import { fetchAPI } from "@/lib/apiClient";
import { MOCK_SOCIOS, MOCK_SOCIOS_DETALLE } from "@/lib/mocks";

export interface SocioListItem {
  id: string;
  nombre: string;
  apellido: string;
  tipoDocumento: string;
  nroDocumento: string;
  obraSocial: string | null;
  plan: string;
  estado: "Activo" | "Baja";
}

let sociosCache: SocioListItem[] | null = null;
const socioDetalleCache = new Map<string, SocioDetalle>();

export async function clearSociosCache() {
  sociosCache = null;
}

export async function obtenerSocios(): Promise<SocioListItem[]> {
  if (process.env.ENV === "develop") {
    if (sociosCache) return sociosCache;
    await new Promise((resolve) => setTimeout(resolve, 600));
    sociosCache = MOCK_SOCIOS;
    return MOCK_SOCIOS;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return [];
  }

  try {
    return await fetchAPI<SocioListItem[]>("/socios", token);
  } catch {
    return [];
  }
}

export interface SocioDetalle {
  id: string;
  nombre: string;
  apellido: string;
  tipoDocumento: string;
  nroDocumento: string;
  fechaNacimiento: string;
  ciudad: string;
  calle: string;
  altura: string;
  fechaAlta: string;
  fechaBaja?: string;
  obraSocial?: string;
  plan: string;
  sepelio?: string;
  cobrador: string;
  telefonos: string[];
  correos: string[];
}

export async function obtenerSocioDetalle(id: string): Promise<SocioDetalle | null> {
  if (process.env.ENV === "develop") {
    if (socioDetalleCache.has(id)) return socioDetalleCache.get(id)!;
    await new Promise((resolve) => setTimeout(resolve, 400));
    const socio = MOCK_SOCIOS_DETALLE.find((s) => s.id === id) ?? null;
    if (socio) socioDetalleCache.set(id, socio);
    return socio;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return null;
  }

  try {
    return await fetchAPI<SocioDetalle>(`/socios/${id}`, token);
  } catch {
    return null;
  }
}
