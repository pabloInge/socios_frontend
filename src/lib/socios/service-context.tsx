"use client"

import { createContext, useContext, useMemo, type ReactNode } from "react"
import { createSociosService, type SociosService } from "./service"

export type { SociosService, SocioListItem, SocioDetalle, SocioFormData } from "./service"

const SociosServiceContext = createContext<SociosService | null>(null)

interface ProviderProps {
  /**
   * Si se usan mocks. El servidor decide este valor (leyendo ENV, que solo
   * existe ahí) y lo pasa como booleano serializable; el cliente construye
   * el servicio con ese flag. Nunca pasar una instancia de servicio desde
   * servidor (Next.js no serializa clases en el boundary).
   */
  mockMode: boolean
  /**
   * Permite inyectar una implementación concreta (tests). Si se pasa, tiene
   * prioridad sobre mockMode. Solo para tests de componentes; en producción
   * el servicio se construye en el cliente a partir de mockMode.
   */
  service?: SociosService
  children: ReactNode
}

export function SociosServiceProvider({ mockMode, service, children }: ProviderProps) {
  // useMemo evita crear una nueva instancia en cada render del provider; de lo
  // contrario el valor del contexto cambia en cada render y todos los
  // consumidores se re-renderizan (además de re-disparar sus useEffect).
  const value = useMemo(
    () => service ?? createSociosService(mockMode),
    [mockMode, service]
  )
  return (
    <SociosServiceContext.Provider value={value}>
      {children}
    </SociosServiceContext.Provider>
  )
}

export function useSociosService(): SociosService {
  const ctx = useContext(SociosServiceContext)
  if (!ctx) {
    throw new Error("useSociosService debe usarse dentro de <SociosServiceProvider>")
  }
  return ctx
}
