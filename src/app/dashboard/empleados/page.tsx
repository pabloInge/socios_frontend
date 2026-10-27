"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, UserCheck } from "lucide-react";

import { DataTable, type Column } from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fabVariants } from "@/components/ui/fab";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type EmpleadoListItem } from "./schema";
import { obtenerEmpleados, darDeBajaEmpleado } from "./actions";

const ESTADO_OPTIONS = [
  { value: "Todos", label: "Todos los estados" },
  { value: "Activo", label: "Activo" },
  { value: "Inactivo", label: "Inactivo" },
];

export default function EmpleadosPage() {
  const router = useRouter();
  const [empleados, setEmpleados] = React.useState<EmpleadoListItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Baja dialog
  const [empleadoParaBaja, setEmpleadoParaBaja] = React.useState<EmpleadoListItem | null>(null);
  const [motivoBaja, setMotivoBaja] = React.useState("");
  const [bajaError, setBajaError] = React.useState<string | null>(null);
  const [bajaLoading, setBajaLoading] = React.useState(false);

  const cargarEmpleados = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerEmpleados();
      setEmpleados(data);
    } catch {
      setEmpleados([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  const handleConfirmarBaja = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empleadoParaBaja) return;

    if (motivoBaja.trim().length < 3) {
      setBajaError("Debe indicar un motivo de baja de al menos 3 caracteres.");
      return;
    }

    setBajaLoading(true);
    setBajaError(null);

    try {
      const targetId = empleadoParaBaja.idEntidadTipo ?? Number(empleadoParaBaja.id);
      const res = await darDeBajaEmpleado(targetId, motivoBaja.trim());
      if (res.success) {
        setEmpleadoParaBaja(null);
        setMotivoBaja("");
        await cargarEmpleados();
      } else {
        setBajaError(res.mensaje || "Error al dar de baja el empleado.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado al dar de baja.";
      setBajaError(msg);
    } finally {
      setBajaLoading(false);
    }
  };

  // Métricas
  const totalEmpleados = empleados.length;
  const activos = empleados.filter((e) => e.estado === "Activo").length;
  const inactivos = totalEmpleados - activos;

  const columns: Column<EmpleadoListItem>[] = React.useMemo(
    () => [
      {
        key: "dni",
        header: "Documento",
        accessor: (e) => (
          <div>
            <span className="font-mono font-medium text-foreground">{e.dni}</span>
            <span className="ml-1.5 text-[11px] text-on-surface-variant uppercase">DNI</span>
          </div>
        ),
        searchable: true,
        searchAccessor: (e) => e.dni,
      },
      {
        key: "nombre",
        header: "Nombre y Apellido",
        accessor: (e) => (
          <p className="font-semibold text-foreground">
            {e.apellido}, {e.nombre}
          </p>
        ),
        searchable: true,
        searchAccessor: (e) => `${e.nombre} ${e.apellido}`,
      },
      {
        key: "sexo",
        header: "Sexo",
        accessor: (e) => (
          <span className="text-sm text-on-surface-variant">
            {e.sexo || "—"}
          </span>
        ),
      },
      {
        key: "telefonos",
        header: "Teléfono",
        accessor: (e) => (
          <span className="text-sm font-mono text-on-surface-variant">
            {e.telefonos.length > 0 ? e.telefonos[0] : "—"}
          </span>
        ),
      },
      {
        key: "estado",
        header: "Estado",
        accessor: (e) => (
          <span
            className={cn(
              "inline-flex items-center rounded-[8px] h-8 px-3.5 text-sm font-medium",
              e.estado === "Activo"
                ? "bg-primary-container text-on-primary-container"
                : "bg-destructive text-white font-medium"
            )}
          >
            {e.estado}
          </span>
        ),
        filterable: true,
        filterOptions: ESTADO_OPTIONS,
        filterAccessor: (e) => e.estado,
      },
    ],
    []
  );

  return (
    <div className="relative h-full p-4 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Listado de Empleados</h1>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          interactive={false}
          className="p-5 flex flex-col items-center justify-center text-center rounded-2xl border-0 shadow-none bg-rose-400 text-white"
        >
          <p className="text-3xl font-bold tracking-tight">{totalEmpleados}</p>
          <p className="text-xs font-medium mt-1 text-white/90">Total Empleados</p>
        </Card>
        <Card
          interactive={false}
          className="p-5 flex flex-col items-center justify-center text-center rounded-2xl border-0 shadow-none bg-sky-500 text-white"
        >
          <p className="text-3xl font-bold tracking-tight">{activos}</p>
          <p className="text-xs font-medium mt-1 text-white/90">Activos</p>
        </Card>
        <Card
          interactive={false}
          className="p-5 flex flex-col items-center justify-center text-center rounded-2xl border-0 shadow-none bg-violet-400 text-white"
        >
          <p className="text-3xl font-bold tracking-tight">{inactivos}</p>
          <p className="text-xs font-medium mt-1 text-white/90">Inactivos</p>
        </Card>
      </div>

      {/* Tabla de Empleados */}
      <DataTable<EmpleadoListItem>
        storageKey="empleados-list-table"
        data={empleados}
        columns={columns}
        getRowId={(e) => e.id}
        loading={loading}
        searchPlaceholder="Buscar por nombre, apellido o DNI"
        emptyMessage="No se encontraron empleados"
        onRowClick={(e) => router.push(`/dashboard/empleados/${e.id}`)}
        renderActions={(e) =>
          e.estado === "Inactivo" ? (
            <Button
              variant="ghost"
              size="icon"
              title="Editar empleado"
              aria-label={`Editar empleado ${e.nombre}`}
              onClick={() => router.push(`/dashboard/empleados/${e.id}?edit=true`)}
            >
              <Edit className="size-4" />
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                title="Editar empleado"
                aria-label={`Editar empleado ${e.nombre}`}
                onClick={() => router.push(`/dashboard/empleados/${e.id}?edit=true`)}
              >
                <Edit className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                title="Dar de baja"
                aria-label={`Dar de baja empleado ${e.nombre}`}
                onClick={() => {
                  setEmpleadoParaBaja(e);
                  setMotivoBaja("");
                  setBajaError(null);
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </>
          )
        }
      />

      <Link
        href="/dashboard/empleados/nuevo"
        className={cn(
          fabVariants({ variant: "primary", size: "large" }),
          "fixed bottom-8 right-8"
        )}
        aria-label="Nuevo empleado"
      >
        <Plus />
      </Link>

      {/* Diálogo de Baja con Motivo */}
      <Dialog
        open={Boolean(empleadoParaBaja)}
        onOpenChange={(open) => {
          if (!open) {
            setEmpleadoParaBaja(null);
            setMotivoBaja("");
            setBajaError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dar de baja empleado</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea dar de baja al empleado{" "}
              <strong>
                {empleadoParaBaja?.nombre} {empleadoParaBaja?.apellido}
              </strong>{" "}
              (DNI {empleadoParaBaja?.dni})? Ingrese el motivo correspondiente.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmarBaja} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="motivoBaja">Motivo de la baja</Label>
              <Input
                id="motivoBaja"
                placeholder="Ej. Renuncia voluntaria, fin de contrato..."
                value={motivoBaja}
                onChange={(e) => setMotivoBaja(e.target.value)}
                required
                autoFocus
              />
              {bajaError && <p className="text-xs text-destructive">{bajaError}</p>}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                disabled={bajaLoading}
                onClick={() => setEmpleadoParaBaja(null)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="default"
                className="bg-destructive text-white hover:bg-destructive/90"
                disabled={bajaLoading}
              >
                {bajaLoading ? "Procesando..." : "Confirmar baja"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
