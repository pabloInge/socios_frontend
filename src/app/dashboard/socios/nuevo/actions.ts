"use server"

import { cookies } from "next/headers";
import { fetchAPI } from "@/lib/apiClient";
import { SocioFormData } from "./schema";

export async function buscarSocioPorDocumento(
  nroDocumento: string
): Promise<SocioFormData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return null;

  try {
    const query = `/socios?nroDocumento=${encodeURIComponent(nroDocumento)}`;
    return await fetchAPI<SocioFormData>(query, token);
  } catch {
    return null;
  }
}

export async function guardarSocio(data: SocioFormData): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return;

  await fetchAPI("/socios", token, { method: "POST", body: JSON.stringify(data) });
}

export async function actualizarSocio(id: string, data: SocioFormData): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return;

  await fetchAPI(`/socios/${id}`, token, { method: "PUT", body: JSON.stringify(data) });
}
