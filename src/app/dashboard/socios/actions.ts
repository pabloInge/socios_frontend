"use server";

import { cookies } from "next/headers";
import { fetchAPI } from "@/lib/apiClient";
import type { Codeudor } from "@/app/dashboard/socios/nuevo/schema";

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

export async function obtenerSocios(): Promise<SocioListItem[]> {
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

export async function obtenerSocioDetalle(id: string): Promise<SocioDetalle | null> {
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

export async function eliminarSocio(id: string): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return false;

  try {
    await fetchAPI(`/socios/${id}`, token, { method: "DELETE" });
    return true;
  } catch {
    return false;
  }
}

export async function reactivarSocio(id: string): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

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
