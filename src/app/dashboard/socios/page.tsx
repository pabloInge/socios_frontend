"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Chip } from "@/components/ui/chip"
import { FilterToggle, FilterToggleTrigger, FilterToggleContent } from "@/components/ui/filter-toggle"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { fabVariants } from "@/components/ui/fab"
import { cn } from "@/lib/utils"

import { obtenerSocios, type SocioListItem } from "./actions"

export default function SociosPage() {
  const router = useRouter()
  const [socios, setSocios] = React.useState<SocioListItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [filterEstado, setFilterEstado] = React.useState("Todos")
  const [filterPlan, setFilterPlan] = React.useState("Todos")
  const [filterObraSocial, setFilterObraSocial] = React.useState("Todos")

  React.useEffect(() => {
    obtenerSocios().then((data) => {
      setSocios(data)
      setLoading(false)
    })
  }, [])

  const uniqueObrasSociales = React.useMemo(() => {
    const obras = socios
      .map((s) => s.obraSocial)
      .filter((v): v is string => v !== null)
    return [...new Set(obras)]
  }, [socios])

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
      const matchesPlan = filterPlan === "Todos" || socio.plan === filterPlan
      const matchesObraSocial =
        filterObraSocial === "Todos" || socio.obraSocial === filterObraSocial

      return matchesSearch && matchesEstado && matchesPlan && matchesObraSocial
    })
  }, [socios, search, filterEstado, filterPlan, filterObraSocial])

  const hasActiveFilters =
    filterEstado !== "Todos" ||
    filterPlan !== "Todos" ||
    filterObraSocial !== "Todos"

  const activeFilterCount = [
    filterEstado !== "Todos",
    filterPlan !== "Todos",
    filterObraSocial !== "Todos",
  ].filter(Boolean).length

  const clearPanelFilters = () => {
    setFilterEstado("Todos")
    setFilterPlan("Todos")
    setFilterObraSocial("Todos")
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
            <div className="w-40">
              <Select value={filterPlan} onValueChange={setFilterPlan}>
                <SelectTrigger label="Plan" variant="outlined">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="A">Plan A</SelectItem>
                  <SelectItem value="B">Plan B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Select value={filterObraSocial} onValueChange={setFilterObraSocial}>
                <SelectTrigger label="Obra Social" variant="outlined">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todas</SelectItem>
                  {uniqueObrasSociales.map((os) => (
                    <SelectItem key={os} value={os}>
                      {os}
                    </SelectItem>
                  ))}
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
          {filterPlan !== "Todos" && (
            <Chip variant="input" onRemove={() => setFilterPlan("Todos")}>
              Plan: {filterPlan}
            </Chip>
          )}
          {filterObraSocial !== "Todos" && (
            <Chip
              variant="input"
              onRemove={() => setFilterObraSocial("Todos")}
            >
              Obra Social: {filterObraSocial}
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
              <TableHead>Obra Social</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full max-w-[120px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredSocios.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
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
                    {socio.tipoDocumento} {socio.nroDocumento}
                  </TableCell>
                  <TableCell>{socio.obraSocial || "\u2014"}</TableCell>
                  <TableCell>{socio.plan}</TableCell>
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
