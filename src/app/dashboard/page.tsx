"use client"

import * as React from "react"
import { Eye, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Fab } from "@/components/ui/fab"
import { DataTable, type Column } from "@/components/ui/data-table"

type Socio = {
  id: number
  nombre: string
  categoria: string
  fecha: string
  estado: "Al día" | "Pendiente" | "Vencido"
}

const tableData: Socio[] = []

const columns: Column<Socio>[] = [
  {
    key: "nombre",
    header: "Nombre completo",
    accessor: (s) => s.nombre,
    className: "font-medium text-foreground",
    searchable: true,
  },
  {
    key: "categoria",
    header: "Categoría",
    accessor: (s) => s.categoria,
    className: "text-on-surface-variant",
    searchable: true,
    filterable: true,
    filterAccessor: (s) => s.categoria,
  },
  {
    key: "fecha",
    header: "Fecha alta",
    accessor: (s) => s.fecha,
    className: "text-on-surface-variant",
    searchable: true,
  },
  {
    key: "estado",
    header: "Estado",
    accessor: (s) => s.estado,
    filterable: true,
    filterAccessor: (s) => s.estado,
  },
]

const m3Easing = "cubic-bezier(0.2, 0.0, 0, 1.0)"

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div
        className="bg-surface-container-lowest rounded-[28px] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700"
        style={{ transitionTimingFunction: m3Easing }}
      >
        <DataTable<Socio>
          storageKey="dashboard-socios"
          data={tableData}
          columns={columns}
          getRowId={(s) => String(s.id)}
          searchPlaceholder="Buscar por nombre, categoría o fecha"
          emptyMessage="No hay registros disponibles."
          className="p-4"
          renderActions={() => (
            <div className="flex items-center justify-center gap-2 transition-opacity duration-300">
              <Button variant="ghost" size="icon" title="Visualizar" aria-label="Visualizar">
                <Eye />
              </Button>
              <Button variant="ghost" size="icon" title="Editar" aria-label="Editar">
                <Edit />
              </Button>
              <Button variant="ghost" size="icon" title="Eliminar" aria-label="Eliminar" className="text-destructive">
                <Trash2 />
              </Button>
            </div>
          )}
        />

        <div className="p-4 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between text-[11px] text-on-surface-variant font-medium">
          <span>Mostrando {tableData.length} registros</span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              Anterior
            </Button>
            <Button variant="default" size="sm">
              1
            </Button>
            <Button variant="secondary" size="sm">
              Siguiente
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <Fab
          title="Nuevo registro"
          icon={<Plus />}
          variant="primary"
        />
      </div>
    </div>
  )
}
