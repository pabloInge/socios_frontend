import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

type NavItem = {
  title: string
  url: string
}

const navItems: NavItem[] = [
  { title: "Caja", url: "/dashboard/caja" },
  { title: "Socios", url: "/dashboard/socios" },
  { title: "Colaboradores", url: "/dashboard/colaboradores" },
  { title: "Proveedores", url: "/dashboard/proveedores" },
  { title: "Reportes", url: "/dashboard/reportes" },
  { title: "Empleados", url: "/dashboard/empleados" },
  { title: "Usuarios", url: "/dashboard/usuarios" },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Centro de Jubilados</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>{item.title}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
