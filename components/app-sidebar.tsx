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
const items = [
  { title: "Usuarios", url: "/dashboard/usuarios" },
  { title: "Empleados", url: "/dashboard/empleados" },
  { title: "Socios", url: "/dashboard/socios" },
  { title: "Colaboradores", url: "/dashboard/colaboradores" },
  { title: "Proveedores", url: "/dashboard/proveedores" },
  { title: "Caja", url: "/dashboard/caja" },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Centro de Jubilados</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
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
