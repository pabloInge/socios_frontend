"use client"

import { createContext, useContext, useMemo, type ReactNode } from "react"
import { createSociosService, type SociosService } from "./service"

export type { SociosService, SocioListItem, SocioDetalle, SocioFormData } from "./service"

const SociosServiceContext = createContext<SociosService | null>(null)

interface ProviderProps {
  mockMode: boolean
  service?: SociosService
  children: ReactNode
}

export function SociosServiceProvider({ mockMode, service, children }: ProviderProps) {
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
