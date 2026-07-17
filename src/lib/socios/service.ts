import {
  devGetSocios,
  devGetSocioDetalle,
  devFindSocioByDocumento,
  devAddSocio,
  devUpdateSocio,
  devRemoveSocio,
} from "@/lib/dev-store"
import {
  obtenerSocios,
  obtenerSocioDetalle,
  eliminarSocio,
  type SocioListItem,
  type SocioDetalle,
} from "@/app/dashboard/socios/actions"
import { guardarSocio, actualizarSocio, buscarSocioPorDocumento } from "@/app/dashboard/socios/nuevo/actions"
import type { SocioFormData } from "@/app/dashboard/socios/nuevo/schema"

export type { SocioListItem, SocioDetalle, SocioFormData }

export interface SociosService {
  list(): Promise<SocioListItem[]>
  get(id: string): Promise<SocioDetalle | null>
  findByDocumento(tipoDocumento: string, nroDocumento: string): Promise<SocioFormData | null>
  create(data: SocioFormData): Promise<void>
  update(id: string, data: SocioFormData): Promise<void>
  remove(id: string): Promise<boolean>
}

function detalleToFormData(d: SocioDetalle): SocioFormData {
  return {
    nombre: d.nombre,
    apellido: d.apellido,
    tipoDocumento: d.tipoDocumento as "DNI" | "CUIT",
    nroDocumento: d.nroDocumento,
    fechaNacimiento: d.fechaNacimiento,
    ciudad: d.ciudad,
    calle: d.calle,
    altura: d.altura,
    fechaAlta: d.fechaAlta,
    fechaBaja: d.fechaBaja,
    obraSocial: d.obraSocial,
    plan: d.plan,
    sepelio: d.sepelio,
    cobrador: d.cobrador,
    telefonos: [...d.telefonos],
    correos: [...d.correos],
  }
}

class MockSociosService implements SociosService {
  async list(): Promise<SocioListItem[]> {
    return devGetSocios()
  }
  async get(id: string): Promise<SocioDetalle | null> {
    return devGetSocioDetalle(id)
  }
  async findByDocumento(tipoDocumento: string, nroDocumento: string): Promise<SocioFormData | null> {
    const d = devFindSocioByDocumento(tipoDocumento, nroDocumento)
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
}

class ApiSociosService implements SociosService {
  async list(): Promise<SocioListItem[]> {
    return obtenerSocios()
  }
  async get(id: string): Promise<SocioDetalle | null> {
    return obtenerSocioDetalle(id)
  }
  async findByDocumento(tipoDocumento: string, nroDocumento: string): Promise<SocioFormData | null> {
    return buscarSocioPorDocumento(tipoDocumento, nroDocumento)
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
}

export function createSociosService(mockMode = false): SociosService {
  return mockMode ? new MockSociosService() : new ApiSociosService()
}
