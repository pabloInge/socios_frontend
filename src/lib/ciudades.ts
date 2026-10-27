import { fetchAPI } from "./apiClient";

export interface Ciudad {
  id: string;
  nombre: string;
}

export interface BackendCiudadRaw {
  id_Ciudad?: number;
  idCiudad?: number;
  id?: number | string;
  nombre?: string;
}

export const MOCK_CIUDADES: Ciudad[] = [
  { id: "1", nombre: "Buenos Aires" },
  { id: "2", nombre: "Córdoba" },
  { id: "3", nombre: "Rosario" },
  { id: "4", nombre: "Santa Fe" },
  { id: "5", nombre: "Paraná" },
  { id: "6", nombre: "Rafaela" },
  { id: "7", nombre: "Venado Tuerto" },
  { id: "8", nombre: "Firmat" },
  { id: "9", nombre: "Cañada de Gómez" },
];

export function findCiudadIdByName(nombre?: string): number {
  if (!nombre) return 1;
  const found = MOCK_CIUDADES.find(
    (c) => c.nombre.toLowerCase() === nombre.trim().toLowerCase()
  );
  return found ? Number(found.id) : 1;
}

export async function buscarCiudades(
  busqueda?: string,
  token?: string
): Promise<Ciudad[]> {
  const queryParams = new URLSearchParams();
  if (busqueda && busqueda.trim()) {
    queryParams.set("Busqueda", busqueda.trim());
  }
  const query = queryParams.toString() ? `?${queryParams.toString()}` : "";

  try {
    const raw = await fetchAPI<BackendCiudadRaw[]>(
      `/ciudades/buscar${query}`,
      token
    );
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((c) => ({
        id: String(c.id_Ciudad ?? c.idCiudad ?? c.id ?? ""),
        nombre: c.nombre ?? "",
      }));
    }
  } catch {
    // Fallback a catálogo estático en caso de desconexión o entorno de pruebas
  }

  if (!busqueda || !busqueda.trim()) {
    return MOCK_CIUDADES;
  }
  const term = busqueda.trim().toLowerCase();
  return MOCK_CIUDADES.filter((c) => c.nombre.toLowerCase().includes(term));
}
