"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Chip } from "@/components/ui/chip"
import { FilterToggle, FilterToggleTrigger, FilterToggleContent } from "@/components/ui/filter-toggle"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { fabVariants } from "@/components/ui/fab"
import { cn } from "@/lib/utils"
import { useSociosService, type SocioListItem } from "@/lib/socios/service-context"

export default function SociosPage() {
  const router = useRouter()
  const sociosService = useSociosService()
  const [socios, setSocios] = React.useState<SocioListItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [filterEstado, setFilterEstado] = React.useState("Todos")

  React.useEffect(() => {
    let cancelled = false
    sociosService
      .list()
      .then((data) => {
        if (cancelled) return
        setSocios(data)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [sociosService])

  const handleEliminar = async (id: string) => {
    const confirmado =
      typeof window === "undefined" || window.confirm("¿Eliminar este socio?")
    if (!confirmado) return
    try {
      const ok = await sociosService.remove(id)
      if (ok) setSocios((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      console.error("Error al eliminar socio:", err)
    }
  }

  const filteredSocios = React.useMemo(() => {
    return socios.filter((socio) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !search ||
        socio.nombre.toLowerCase().includes(q) ||
        socio.apellido.toLowerCase().includes(q) ||
        socio.nroDocumento.includes(search)

      const matchesEstado =
        filterEstado === "Todos" || socio.estado === filterEstado

      return matchesSearch && matchesEstado
    })
  }, [socios, search, filterEstado])

  const hasActiveFilters = filterEstado !== "Todos"

  const activeFilterCount = hasActiveFilters ? 1 : 0

  const clearPanelFilters = () => {
    setFilterEstado("Todos")
  }

  return (
    <div className="relative h-full p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Listado de Socios</h1>

      <FilterToggle className="mb-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              label="Buscar por nombre, apellido o documento"
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <FilterToggleTrigger
            activeCount={activeFilterCount}
            onClear={hasActiveFilters ? clearPanelFilters : undefined}
          />
        </div>
        <FilterToggleContent>
          <div className="flex flex-wrap gap-4">
            <div className="w-40">
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger label="Estado" variant="outlined">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </FilterToggleContent>
      </FilterToggle>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filterEstado !== "Todos" && (
            <Chip
              variant="input"
              onRemove={() => setFilterEstado("Todos")}
            >
              Estado: {filterEstado}
            </Chip>
          )}
        </div>
      )}

      <div className="rounded-xl border border-outline-variant overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full max-w-[120px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredSocios.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-on-surface-variant"
                >
                  No se encontraron socios
                </TableCell>
              </TableRow>
            ) : (
              filteredSocios.map((socio) => (
                <TableRow
                  key={socio.id}
                  className="cursor-pointer"
                  tabIndex={0}
                  role="link"
                  onClick={() =>
                    router.push(`/dashboard/socios/${socio.id}`)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      router.push(`/dashboard/socios/${socio.id}`)
                    }
                  }}
                >
                  <TableCell>{socio.nombre}</TableCell>
                  <TableCell>{socio.apellido}</TableCell>
                  <TableCell>
                    {socio.nroDocumento}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-[8px] h-7 px-3 text-xs font-medium",
                        socio.estado === "Activo"
                          ? "bg-primary-container text-on-primary-container"
                          : "bg-destructive/10 text-destructive"
                      )}
                    >
                      {socio.estado}
                    </span>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Editar"
                        onClick={() =>
                          router.push(`/dashboard/socios/nuevo?edit=${socio.id}`)
                        }
                      >
                        <Edit />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Eliminar"
                        className="text-destructive"
                        onClick={() => handleEliminar(socio.id)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredSocios.length > 0 && !loading && (
        <p className="text-sm text-on-surface-variant mt-3">
          {filteredSocios.length} socio{filteredSocios.length !== 1 && "s"} encontrado{filteredSocios.length !== 1 && "s"}
        </p>
      )}

      <Link
        href="/dashboard/socios/nuevo"
        className={cn(
          fabVariants({ variant: "primary", size: "large" }),
          "fixed bottom-8 right-8"
        )}
        aria-label="Nuevo socio"
      >
        <Plus />
      </Link>
    </div>
  )
}
