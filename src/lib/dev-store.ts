import { MOCK_SOCIOS, MOCK_SOCIOS_DETALLE } from "@/lib/mocks"
import type { SocioListItem, SocioDetalle } from "@/app/dashboard/socios/actions"
import { normalizeContacts, type SocioFormData } from "@/app/dashboard/socios/nuevo/schema"

function toListItem(d: SocioDetalle): SocioListItem {
  return {
    id: d.id,
    nombre: d.nombre,
    apellido: d.apellido,
    tipoDocumento: d.tipoDocumento,
    nroDocumento: d.nroDocumento,
    obraSocial: d.obraSocial ?? null,
    plan: d.plan,
    estado: d.fechaBaja ? "Baja" : "Activo",
  }
}

interface DevStoreState {
  list: SocioListItem[]
  detalle: SocioDetalle[]
  nextId: number
}

function seed(): DevStoreState {
  return {
    list: MOCK_SOCIOS.map((s) => ({ ...s })),
    detalle: MOCK_SOCIOS_DETALLE.map((s) => ({ ...s })),
    nextId: MOCK_SOCIOS.reduce((max, s) => Math.max(max, Number(s.id) || 0), 0) + 1,
  }
}

let state: DevStoreState = seed()

export function _resetDevStoreForTests(): void {
  state = seed()
}

export function devGetSocios(): SocioListItem[] {
  return state.list.map((s) => ({ ...s }))
}

export function devGetSocioDetalle(id: string): SocioDetalle | null {
  const found = state.detalle.find((s) => s.id === id)
  return found ? { ...found, telefonos: [...found.telefonos], correos: [...found.correos] } : null
}

export function devAddSocio(data: SocioFormData): string {
  const id = String(state.nextId++)
  const detalle: SocioDetalle = {
    id,
    nombre: data.nombre,
    apellido: data.apellido,
    tipoDocumento: data.tipoDocumento,
    nroDocumento: data.nroDocumento,
    fechaNacimiento: data.fechaNacimiento,
    ciudad: data.ciudad,
    calle: data.calle,
    altura: data.altura,
    fechaAlta: data.fechaAlta,
    fechaBaja: data.fechaBaja,
    obraSocial: data.obraSocial,
    plan: data.plan,
    sepelio: data.sepelio,
    cobrador: data.cobrador,
    telefonos: normalizeContacts(data.telefonos),
    correos: normalizeContacts(data.correos),
  }
  state.detalle.push(detalle)
  state.list.push(toListItem(detalle))
  return id
}

export function devUpdateSocio(id: string, data: SocioFormData): boolean {
  const idx = state.detalle.findIndex((s) => s.id === id)
  if (idx === -1) return false
  const prev = state.detalle[idx]
  const updated: SocioDetalle = {
    ...prev,
    nombre: data.nombre,
    apellido: data.apellido,
    tipoDocumento: data.tipoDocumento,
    nroDocumento: data.nroDocumento,
    fechaNacimiento: data.fechaNacimiento,
    ciudad: data.ciudad,
    calle: data.calle,
    altura: data.altura,
    fechaAlta: data.fechaAlta,
    fechaBaja: data.fechaBaja,
    obraSocial: data.obraSocial,
    plan: data.plan,
    sepelio: data.sepelio,
    cobrador: data.cobrador,
    telefonos: normalizeContacts(data.telefonos),
    correos: normalizeContacts(data.correos),
  }
  state.detalle[idx] = updated
  const lidx = state.list.findIndex((s) => s.id === id)
  if (lidx !== -1) state.list[lidx] = toListItem(updated)
  return true
}

export function devFindSocioByDocumento(
  tipoDocumento: string,
  nroDocumento: string
): SocioDetalle | null {
  const found = state.detalle.find(
    (s) => s.tipoDocumento === tipoDocumento && s.nroDocumento === nroDocumento
  )
  return found
    ? { ...found, telefonos: [...found.telefonos], correos: [...found.correos] }
    : null
}

export function devRemoveSocio(id: string): boolean {
  const before = state.list.length
  state.list = state.list.filter((s) => s.id !== id)
  state.detalle = state.detalle.filter((s) => s.id !== id)
  return state.list.length < before
}
