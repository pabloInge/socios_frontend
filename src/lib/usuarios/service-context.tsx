"use client"

import { createContext, useContext, useMemo, type ReactNode } from "react"
import { createUsuariosService, type UsuariosService } from "./service"

export type { UsuariosService } from "./service"

const UsuariosServiceContext = createContext<UsuariosService | null>(null)

interface ProviderProps {
  mockMode: boolean
  service?: UsuariosService
  children: ReactNode
}

export function UsuariosServiceProvider({ mockMode, service, children }: ProviderProps) {
  const value = useMemo(
    () => service ?? createUsuariosService(mockMode),
    [mockMode, service]
  )
  return (
    <UsuariosServiceContext.Provider value={value}>
      {children}
    </UsuariosServiceContext.Provider>
  )
}

export function useUsuariosService(): UsuariosService {
  const ctx = useContext(UsuariosServiceContext)
  if (!ctx) {
    throw new Error("useUsuariosService debe usarse dentro de <UsuariosServiceProvider>")
  }
  return ctx
}
