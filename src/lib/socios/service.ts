import {
  devGetSocios,
  devGetSocioDetalle,
  devFindSocioByDocumento,
  devAddSocio,
  devUpdateSocio,
  devRemoveSocio,
  devReactivateSocio,
} from "@/lib/dev-store"
import {
  obtenerSocios,
  obtenerSocioDetalle,
  eliminarSocio,
  reactivarSocio,
  type SocioListItem,
  type SocioDetalle,
  type SocioFiltroDto,
} from "@/app/dashboard/socios/actions"
import { guardarSocio, actualizarSocio, buscarSocioPorDocumento } from "@/app/dashboard/socios/nuevo/actions"
import type { SocioFormData } from "@/app/dashboard/socios/nuevo/schema"

export type { SocioListItem, SocioDetalle, SocioFormData, SocioFiltroDto }

export interface SociosService {
  list(filtro?: SocioFiltroDto): Promise<SocioListItem[]>
  get(id: string): Promise<SocioDetalle | null>
  findByDocumento(nroDocumento: string): Promise<(SocioFormData & { id?: string }) | null>
  create(data: SocioFormData): Promise<void>
  update(id: string, data: SocioFormData): Promise<void>
  remove(id: string): Promise<boolean>
  reactivate(id: string): Promise<boolean>
}

function detalleToFormData(d: SocioDetalle): SocioFormData & { id?: string } {
  return {
    id: d.id,
    nombre: d.nombre,
    apellido: d.apellido,
    nroDocumento: d.nroDocumento,
    fechaNacimiento: d.fechaNacimiento,
    sexo: d.sexo ?? "",
    ciudad: d.ciudad,
    calle: d.calle,
    altura: d.altura,
    fechaAlta: d.fechaAlta,
    fechaBaja: d.fechaBaja,
    obraSocial: d.obraSocial,
    nroAfiliadoObraSocial: d.nroAfiliadoObraSocial,
    plan: d.plan,
    sepelio: d.sepelio,
    cobrador: d.cobrador,
    observaciones: d.observaciones,
    telefonos: [...d.telefonos],
    correos: [...d.correos],
    codeudores: (d.codeudores ?? []).map((c) => ({ ...c })),
  }
}

class MockSociosService implements SociosService {
  async list(filtro?: SocioFiltroDto): Promise<SocioListItem[]> {
    let result = devGetSocios();
    if (filtro?.incluirInactivos === false) {
      result = result.filter((s) => s.estado === "Activo");
    }
    if (filtro?.busqueda) {
      const b = filtro.busqueda.toLowerCase();
      result = result.filter(
        (s) => s.nombre.toLowerCase().includes(b) || s.apellido.toLowerCase().includes(b)
      );
    }
    if (filtro?.dni) {
      result = result.filter((s) => s.nroDocumento.includes(filtro.dni!));
    }
    return result;
  }
  async get(id: string): Promise<SocioDetalle | null> {
    return devGetSocioDetalle(id)
  }
  async findByDocumento(nroDocumento: string): Promise<(SocioFormData & { id?: string }) | null> {
    const d = devFindSocioByDocumento(nroDocumento)
    return d ? detalleToFormData(d) : null
  }
  async create(data: SocioFormData): Promise<void> {
    devAddSocio(data)
  }
  async update(id: string, data: SocioFormData): Promise<void> {
    devUpdateSocio(id, data)
  }
  async remove(id: string): Promise<boolean> {
    return devRemoveSocio(id)
  }
  async reactivate(id: string): Promise<boolean> {
    return devReactivateSocio(id)
  }
}

class ApiSociosService implements SociosService {
  async list(filtro?: SocioFiltroDto): Promise<SocioListItem[]> {
    return obtenerSocios(filtro)
  }
  async get(id: string): Promise<SocioDetalle | null> {
    return obtenerSocioDetalle(id)
  }
  async findByDocumento(nroDocumento: string): Promise<(SocioFormData & { id?: string }) | null> {
    return buscarSocioPorDocumento(nroDocumento)
  }
  async create(data: SocioFormData): Promise<void> {
    await guardarSocio(data)
  }
  async update(id: string, data: SocioFormData): Promise<void> {
    await actualizarSocio(id, data)
  }
  async remove(id: string): Promise<boolean> {
    return eliminarSocio(id)
  }
  async reactivate(id: string): Promise<boolean> {
    return reactivarSocio(id)
  }
}

export function createSociosService(mockMode = false): SociosService {
  return mockMode ? new MockSociosService() : new ApiSociosService()
}
