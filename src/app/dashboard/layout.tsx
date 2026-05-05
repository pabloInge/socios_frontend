import { DashboardLayoutClient } from "@/components/dashboard-layout-client"
import { obtenerSesion } from "@/lib/auth"
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

  return <DashboardLayoutClient usuario={session}>{children}</DashboardLayoutClient>
}
