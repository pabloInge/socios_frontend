"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/ui/data-table"
import { fabVariants } from "@/components/ui/fab"
import { cn } from "@/lib/utils"
import { useSociosService, type SocioListItem } from "@/lib/socios/service-context"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

const ESTADO_OPTIONS = [
  { value: "Activo", label: "Activo" },
  { value: "Baja", label: "Baja" },
]

export default function SociosPage() {
  const router = useRouter()
  const sociosService = useSociosService()
  const [socios, setSocios] = React.useState<SocioListItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [socioToDelete, setSocioToDelete] = React.useState<SocioListItem | null>(null)

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

  const handleConfirmEliminar = async () => {
    if (!socioToDelete) return
    try {
      const ok = await sociosService.remove(socioToDelete.id)
      if (ok) {
        setSocios((prev) => prev.filter((s) => s.id !== socioToDelete.id))
      }
    } catch (err) {
      console.error("Error al eliminar socio:", err)
    } finally {
      setSocioToDelete(null)
    }
  }

  const columns: Column<SocioListItem>[] = React.useMemo(
    () => [
      {
        key: "nombre",
        header: "Nombre",
        accessor: (s) => s.nombre,
        searchable: true,
      },
      {
        key: "apellido",
        header: "Apellido",
        accessor: (s) => s.apellido,
        searchable: true,
      },
      {
        key: "nroDocumento",
        header: "Documento",
        accessor: (s) => s.nroDocumento,
        searchable: true,
      },
      {
        key: "obraSocial",
        header: "Obra Social",
        accessor: (s) => s.obraSocial ?? "—",
        filterable: true,
        filterAccessor: (s) => s.obraSocial ?? "—",
      },
      {
        key: "plan",
        header: "Plan",
        accessor: (s) => s.plan,
        filterable: true,
        filterAccessor: (s) => s.plan,
      },
      {
        key: "estado",
        header: "Estado",
        accessor: (s) => (
          <span
            className={cn(
              "inline-flex items-center rounded-[8px] h-8 px-3.5 text-sm font-medium",
              s.estado === "Activo"
                ? "bg-primary-container text-on-primary-container"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {s.estado}
          </span>
        ),
        filterable: true,
        filterOptions: ESTADO_OPTIONS,
        filterAccessor: (s) => s.estado,
      },
    ],
    []
  )

  return (
    <div className="relative h-full p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Listado de Socios</h1>

      <DataTable<SocioListItem>
        storageKey="socios-list"
        data={socios}
        columns={columns}
        getRowId={(s) => s.id}
        searchPlaceholder="Buscar por nombre, apellido o documento"
        loading={loading}
        emptyMessage="No se encontraron socios"
        onRowClick={(s) => router.push(`/dashboard/socios/${s.id}`)}
        renderActions={(s) => (
          <>
            <Button
              variant="ghost"
              size="icon"
              title="Editar"
              aria-label="Editar"
              onClick={() =>
                router.push(`/dashboard/socios/nuevo?edit=${s.id}`)
              }
            >
              <Edit />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Eliminar"
              aria-label="Eliminar"
              className="text-destructive"
              onClick={() => setSocioToDelete(s)}
            >
              <Trash2 />
            </Button>
          </>
        )}
      />

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

      <ConfirmDialog
        open={!!socioToDelete}
        onOpenChange={(open) => {
          if (!open) setSocioToDelete(null)
        }}
        variant="destructive"
        title="¿Eliminar socio?"
        description={
          socioToDelete
            ? `¿Está seguro de que desea eliminar a ${socioToDelete.nombre} ${socioToDelete.apellido}? Esta acción no se puede deshacer.`
            : "Esta acción no se puede deshacer."
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmEliminar}
      />
    </div>
  )
}
