"use client"

import React, { useState, useRef, useEffect } from "react"
import { Usuario } from "@/lib/auth"
import {
  Users,
  Briefcase,
  UserPlus,
  Truck,
  Wallet,
  ChevronDown,
  Menu,
  Bell,
  LogOut,
  User,
  Settings,
  Grid,
  CreditCard,
  FileText,
  HeartHandshake,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"



const m3Easing = "cubic-bezier(0.2, 0.0, 0, 1.0)"

type NavSubItem = {
  id: string
  label: string
  icon: React.ReactNode
  url?: string
}

type NavItem = {
  id: string
  label: string
  icon: React.ReactNode
  url?: string
  subItems?: NavSubItem[]
}

const navItems: NavItem[] = [
  { id: "usuarios", label: "Usuarios", icon: <Users size={22} /> },
  { id: "empleados", label: "Empleados", icon: <Briefcase size={22} /> },
  {
    id: "socios",
    label: "Socios",
    icon: <Users size={22} />,
    url: "/dashboard/socios",
    subItems: [
      { id: "nichos", label: "Nichos", icon: <Grid size={18} /> },
      {
        id: "config_cuotas",
        label: "Configuración cuotas",
        icon: <CreditCard size={18} />,
      },
      { id: "generar_deuda", label: "Generar deuda", icon: <FileText size={18} /> },
    ],
  },
  {
    id: "colaboradores",
    label: "Colaboradores",
    icon: <UserPlus size={22} />,
    subItems: [
      {
        id: "prestaciones",
        label: "Prestaciones",
        icon: <HeartHandshake size={18} />,
      },
    ],
  },
  { id: "proveedores", label: "Proveedores", icon: <Truck size={22} /> },
  { id: "caja", label: "Caja", icon: <Wallet size={22} /> },
]

export function DashboardLayoutClient({ 
  children, 
  usuario 
}: { 
  children: React.ReactNode,
  usuario: Usuario
}) {
  const router = useRouter()
  const pathname = usePathname()
  
  const activeItem = React.useMemo(() => {
    const matchingItem = navItems.find(item => 
      (item.url && pathname === item.url) || 
      (item.subItems && item.subItems.some(sub => pathname === sub.url))
    )
    if (matchingItem) return matchingItem.id
    
    const allSubItems = navItems.flatMap(i => i.subItems || [])
    const matchingSub = allSubItems.find(sub => sub.url && pathname === sub.url)
    return matchingSub ? matchingSub.id : "usuarios"
  }, [pathname])

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    socios: false,
    colaboradores: false,
  })
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const matchingItem = navItems.find(item => 
      (item.url && pathname === item.url) || 
      (item.subItems && item.subItems.some(sub => pathname === sub.url))
    )
    
    if (matchingItem && matchingItem.subItems) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpandedItems(prev => ({ ...prev, [matchingItem.id]: true }))
    }
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleSubmenu = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex h-screen w-full bg-background text-foreground font-sans overflow-hidden select-none">
      <aside
        className={`${
          isSidebarOpen ? "w-72" : "w-20"
        } transition-all duration-500 bg-surface-container-lowest border-r border-outline-variant flex flex-col relative z-20`}
        style={{ transitionTimingFunction: m3Easing }}
      >
        <div className="px-4 flex items-center h-20 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex-shrink-0"
          >
            <Menu size={24} />
          </Button>

          <div
            className={`flex items-center overflow-hidden transition-all duration-500 whitespace-nowrap
              ${isSidebarOpen ? "max-w-xs opacity-100 ml-4" : "max-w-0 opacity-0 ml-0"}`}
            style={{ transitionTimingFunction: m3Easing }}
          >
            <span className="text-xl font-semibold tracking-tight text-foreground">
              Centro de Jubilados
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 space-y-2 custom-scrollbar overflow-x-hidden">
          {navItems.map((item) => (
            <div key={item.id} className="w-full">
              <Button
                variant="ghost"
                onClick={() => {
                  if (item.subItems) toggleSubmenu(item.id)
                  if (item.url) router.push(item.url)
                }}
                className={cn(
                  "relative w-full justify-start h-auto px-4 py-3 group",
                  activeItem === item.id
                    ? "bg-primary-container text-on-primary-container hover:bg-primary-container/90"
                    : "text-on-surface-variant hover:bg-surface-container",
                  !isSidebarOpen && "justify-center px-0"
                )}
                style={{ transitionTimingFunction: m3Easing }}
              >
                <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                  {item.icon}
                </div>
                {isSidebarOpen && (
                  <>
                    <span
                      className={`flex-1 text-left text-sm font-medium ${
                        activeItem === item.id ? "opacity-100" : "opacity-90"
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.subItems && (
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-500 ${
                          expandedItems[item.id] ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </>
                )}
              </Button>

              {item.subItems && (
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    expandedItems[item.id] ? "max-h-64 mt-1 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div
                    className={`${
                      isSidebarOpen ? "ml-7 pl-4 border-l" : "flex flex-col items-center"
                    } border-outline-variant space-y-1 py-1`}
                  >
                    {item.subItems.map((sub) => (
                      <Button
                        variant="ghost"
                        key={sub.id}
                        onClick={() => {
                          if (sub.url) router.push(sub.url)
                        }}
                        className={cn(
                          "w-full justify-start h-auto",
                          isSidebarOpen ? "gap-3 px-4 py-2.5 text-sm" : "justify-center p-2.5",
                          activeItem === sub.id
                            ? "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/90"
                            : "text-on-surface-variant hover:bg-surface-container"
                        )}
                      >
                        <div className="flex-shrink-0">{sub.icon}</div>
                        {isSidebarOpen && <span>{sub.label}</span>}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-8 flex-shrink-0 z-10">
          <div>
            <h2 className="text-sm font-semibold text-primary tracking-tight">
              Gestión /{" "}
              {navItems.find((i) => i.id === activeItem)?.label ||
                navItems
                  .flatMap((i) => i.subItems || [])
                  .find((sub) => sub.id === activeItem)?.label ||
                "Sistema"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon-sm" className="text-on-surface-variant">
              <Bell size={20} />
            </Button>
            <div className="relative" ref={profileRef}>
              <Button
                variant="ghost"
                shape="default"
                size="icon-lg"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-1 hover:bg-surface-container-low border border-transparent hover:border-outline-variant"
              >
                <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-sm">
                  {usuario.nombre
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .substring(0, 2)}
                </div>
              </Button>
              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-3 w-60 bg-surface-container-lowest rounded-[24px] border border-outline-variant py-4 z-[100] animate-in zoom-in-95 duration-300 shadow-m3-3"
                  style={{ transitionTimingFunction: m3Easing }}
                >
                  <div className="px-6 mb-3">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-0.5">
                      Usuario
                    </p>
                    <p className="text-lg font-semibold text-foreground">{usuario.nombre}</p>
                  </div>
                  <div className="h-[1px] bg-outline-variant mx-4 mb-2"></div>
                  <div className="px-2 space-y-0.5">
                    <Button variant="ghost" className="w-full justify-start h-10 text-on-surface-variant">
                      <User size={18} className="text-primary" /> <span>Mis datos</span>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start h-10 text-on-surface-variant">
                      <Settings size={18} className="text-primary" />{" "}
                      <span>Preferencias</span>
                    </Button>
                    <div className="h-[1px] bg-outline-variant mx-3 my-1.5"></div>
                    <Button variant="ghost" className="w-full justify-start h-10 text-destructive hover:bg-destructive/10 hover:text-destructive">
                      <LogOut size={18} /> <span>Cerrar sesión</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 bg-background">{children}</div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--color-outline-variant); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--color-outline); }
      `}} />
    </div>
  )
}
