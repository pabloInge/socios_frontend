import { fetchAPI } from "./apiClient";

export interface ObraSocial {
  id: string;
  nombre: string;
}

export interface BackendObraSocialRaw {
  id_ObraSocial?: number;
  idObraSocial?: number;
  id?: number | string;
  nombreObraSocial?: string;
  nombre?: string;
}

export const MOCK_OBRAS_SOCIALES: ObraSocial[] = [
  { id: "1", nombre: "PAMI" },
  { id: "2", nombre: "IAPOS" },
  { id: "3", nombre: "OSDE" },
  { id: "4", nombre: "Jerárquicos Salud" },
];

export function findObraSocialIdByName(nombre?: string): number | undefined {
  if (!nombre) return undefined;
  const found = MOCK_OBRAS_SOCIALES.find(
    (o) => o.nombre.toLowerCase() === nombre.trim().toLowerCase()
  );
  return found ? Number(found.id) : undefined;
}

export async function buscarObrasSociales(
  busqueda?: string,
  token?: string
): Promise<ObraSocial[]> {
  const queryParams = new URLSearchParams();
  if (busqueda && busqueda.trim()) {
    queryParams.set("Busqueda", busqueda.trim());
  }
  const query = queryParams.toString() ? `?${queryParams.toString()}` : "";

  try {
    const raw = await fetchAPI<BackendObraSocialRaw[]>(
      `/obrassociales/buscar${query}`,
      token
    );
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((o) => ({
        id: String(o.id_ObraSocial ?? o.idObraSocial ?? o.id ?? ""),
        nombre: o.nombreObraSocial ?? o.nombre ?? "",
      }));
    }
  } catch {
    // Fallback a catálogo estático en caso de desconexión o entorno de pruebas
  }

  if (!busqueda || !busqueda.trim()) {
    return MOCK_OBRAS_SOCIALES;
  }
  const term = busqueda.trim().toLowerCase();
  return MOCK_OBRAS_SOCIALES.filter((o) => o.nombre.toLowerCase().includes(term));
}
