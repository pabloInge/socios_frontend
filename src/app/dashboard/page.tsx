"use client"

import React from "react"
import { Eye, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Fab } from "@/components/ui/fab"
import { Chip } from "@/components/ui/chip"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

type Socio = {
  id: number
  nombre: string
  categoria: string
  fecha: string
  estado: "Al día" | "Pendiente" | "Vencido"
}

// Data limpia, sin registros fantasmas
const tableData: Socio[] = []

const m3Easing = "cubic-bezier(0.2, 0.0, 0, 1.0)"

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div
        className="bg-surface-container-lowest rounded-[28px] border border-outline-variant overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700"
        style={{ transitionTimingFunction: m3Easing }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre completo</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Fecha alta</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.length > 0 ? (
              tableData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-foreground font-medium">
                    {row.nombre}
                  </TableCell>
                  <TableCell className="text-on-surface-variant">{row.categoria}</TableCell>
                  <TableCell className="text-on-surface-variant">{row.fecha}</TableCell>
                  <TableCell>
                    <Chip
                      variant="assist"
                      className="pointer-events-none"
                    >
                      {row.estado}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2 transition-opacity duration-300">
                      <Button variant="ghost" size="icon-sm" title="Visualizar">
                        <Eye />
                      </Button>
                      <Button variant="ghost" size="icon-sm" title="Editar">
                        <Edit />
                      </Button>
                      <Button variant="ghost" size="icon-sm" title="Eliminar" className="text-destructive">
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-on-surface-variant">
                  No hay registros disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

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
