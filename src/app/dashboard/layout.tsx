import { DashboardLayoutClient } from "@/components/dashboard-layout-client"
import { obtenerSesion } from "@/lib/auth"
import { isMockMode } from "@/lib/env"
import { SociosServiceProvider } from "@/lib/socios/service-context"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await obtenerSesion()

  if (!session?.logueado) {
    redirect("/login")
  }

  const mockMode = isMockMode()

  return (
    <DashboardLayoutClient usuario={session}>
      <SociosServiceProvider mockMode={mockMode}>{children}</SociosServiceProvider>
    </DashboardLayoutClient>
  )
}
