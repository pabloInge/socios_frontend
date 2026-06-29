"use server";

import { cookies } from "next/headers";
import { fetchAPI } from "@/lib/apiClient";
import { MOCK_SOCIOS } from "@/lib/mocks";

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

export async function obtenerSocios(): Promise<SocioListItem[]> {
  if (process.env.ENV === "develop") {
    await new Promise((resolve) => setTimeout(resolve, 600));
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
