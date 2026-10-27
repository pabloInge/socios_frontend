"use server";

import { fetchAPI } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/auth";
import {
  type NichoItem,
  type NichoFiltros,
  type SocioAsignableNicho,
  type CrearNichoFormData,
  type AsignarNichoFormData,
  crearNichoSchema,
  asignarNichoSchema,
  bajaNichoSchema,
} from "./schema";

interface BackendNichoDto {
  id_Nicho?: number;
  idNicho?: number;
  id?: number | string;
  id_Entidad?: number | null;
  entidadNombre?: string | null;
  nroNicho?: number | string;
  sector?: string;
  ocupado?: boolean | string;
  conLapida?: string | boolean;
  valorNicho?: number;
  valorLapida?: number;
  cuotas?: number;
  interesMensual?: number;
  interes?: number;
  socio?: {
    id_Socio?: number;
    idSocio?: number;
    id?: number | string;
    nombre?: string;
    apellido?: string;
  } | null;
}

interface BackendSocioAsignableDto {
  idSocio: number;
  idEntidad: number;
  nombre: string;
  apellido: string;
  dni: string;
}

export async function obtenerNichos(
  filtros?: NichoFiltros
): Promise<NichoItem[]> {
  const token = await getAuthToken();

  if (!token) return [];

  const queryParams = new URLSearchParams();
  if (filtros?.busqueda) queryParams.set("Busqueda", filtros.busqueda);
  if (filtros?.sectorNumero) queryParams.set("SectorNumero", filtros.sectorNumero);
  if (filtros?.ocupado !== undefined) {
    queryParams.set("Ocupado", String(filtros.ocupado));
  }

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

  try {
    const raw = await fetchAPI<BackendNichoDto[]>(
      `/nichos${queryString}`,
      token
    );

    if (!Array.isArray(raw)) return [];

    return raw.map((n) => {
      const idRaw = n.id_Nicho ?? n.idNicho ?? n.id ?? 0;
      const isOcupado =
        typeof n.ocupado === "string"
          ? n.ocupado.toUpperCase() === "SI"
          : Boolean(n.ocupado);

      const hasLapida =
        typeof n.conLapida === "string"
          ? n.conLapida.toUpperCase() === "SI"
          : Boolean(n.conLapida);

      let socioObj = null;
      if (n.socio && (n.socio.nombre || n.socio.apellido)) {
        const idSocio = n.socio.id_Socio ?? n.socio.idSocio ?? n.socio.id ?? "";
        socioObj = {
          id: String(idSocio),
          nombre: n.socio.nombre || "",
          apellido: n.socio.apellido || "",
        };
      } else if (n.entidadNombre) {
        socioObj = {
          id: String(n.id_Entidad ?? ""),
          nombre: n.entidadNombre,
          apellido: "",
        };
      }

      return {
        id: String(idRaw),
        nroNicho: String(n.nroNicho ?? ""),
        sector: n.sector || "-",
        ocupado: isOcupado,
        conLapida: hasLapida,
        valorNicho: Number(n.valorNicho ?? 0),
        valorLapida: Number(n.valorLapida ?? 0),
        cuotas: Number(n.cuotas ?? 0),
        interes: Number(n.interesMensual ?? n.interes ?? 0),
        socio: socioObj,
      };
    });
  } catch {
    return [];
  }
}

export async function buscarSociosAsignablesNicho(
  busqueda?: string
): Promise<SocioAsignableNicho[]> {
  const token = await getAuthToken();

  if (!token) return [];

  const queryParams = new URLSearchParams();
  if (busqueda && busqueda.trim()) {
    queryParams.set("busqueda", busqueda.trim());
  }

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

  try {
    const raw = await fetchAPI<BackendSocioAsignableDto[]>(
      `/socios/asignables-nicho${queryString}`,
      token
    );

    if (!Array.isArray(raw)) return [];

    return raw.map((s) => ({
      idSocio: s.idSocio,
      idEntidad: s.idEntidad,
      nombre: s.nombre,
      apellido: s.apellido,
      dni: s.dni,
    }));
  } catch {
    return [];
  }
}

export async function crearNicho(
  data: CrearNichoFormData
): Promise<{ success: boolean; idNicho?: number; mensaje?: string }> {
  const parsed = crearNichoSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      mensaje: parsed.error.issues[0]?.message || "Datos inválidos",
    };
  }

  const token = await getAuthToken();
  if (!token) return { success: false, mensaje: "No autenticado" };

  try {
    const res = await fetchAPI<{ idNicho: number }>("/nichos/crear", token, {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });
    return { success: true, idNicho: res?.idNicho };
  } catch (err: unknown) {
    const mensaje = err instanceof Error ? err.message : "Error al crear el nicho";
    return { success: false, mensaje };
  }
}

export async function darDeBajaNicho(
  idNicho: number
): Promise<{ success: boolean; mensaje?: string }> {
  const parsed = bajaNichoSchema.safeParse({ idNicho });
  if (!parsed.success) {
    return { success: false, mensaje: "Id de nicho inválido" };
  }

  const token = await getAuthToken();
  if (!token) return { success: false, mensaje: "No autenticado" };

  try {
    const res = await fetchAPI<{ mensaje: string }>("/nichos/baja", token, {
      method: "POST",
      body: JSON.stringify({ idNicho }),
    });
    return { success: true, mensaje: res?.mensaje };
  } catch (err: unknown) {
    const mensaje = err instanceof Error ? err.message : "Error al eliminar el nicho";
    return { success: false, mensaje };
  }
}

export async function asignarNicho(
  data: AsignarNichoFormData
): Promise<{ success: boolean; mensaje?: string }> {
  const parsed = asignarNichoSchema.safeParse(data);
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
      idNicho: parsed.data.idNicho,
      idEntidad: parsed.data.idEntidad,
      valorTotal: parsed.data.valorTotal,
      cuotas: parsed.data.cuotas,
      interesPorCuota: parsed.data.interesPorCuota,
      conLapida: parsed.data.conLapida,
      valorLapida: parsed.data.conLapida === "SI" ? parsed.data.valorLapida : 0,
    };

    const res = await fetchAPI<{ mensaje: string }>("/nichos/asignar", token, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return { success: true, mensaje: res?.mensaje };
  } catch (err: unknown) {
    const mensaje = err instanceof Error ? err.message : "Error al asignar el nicho";
    return { success: false, mensaje };
  }
}
