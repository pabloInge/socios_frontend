"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, UserCheck } from "lucide-react";

import { DataTable, type Column } from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
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
import { type ColaboradorListItem } from "./schema";
import {
  obtenerColaboradores,
  darDeBajaColaborador,
  reactivarColaborador,
} from "./actions";

const ESTADO_OPTIONS = [
  { value: "Todos", label: "Todos los estados" },
  { value: "Activo", label: "Activo" },
  { value: "Inactivo", label: "Inactivo" },
];

export default function ColaboradoresPage() {
  const router = useRouter();
  const [colaboradores, setColaboradores] = React.useState<ColaboradorListItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Estados de acciones
  const [colaboradorParaBaja, setColaboradorParaBaja] = React.useState<ColaboradorListItem | null>(null);
  const [motivoBaja, setMotivoBaja] = React.useState("");
  const [bajaError, setBajaError] = React.useState<string | null>(null);
  const [bajaLoading, setBajaLoading] = React.useState(false);

  const [colaboradorParaReactivar, setColaboradorParaReactivar] = React.useState<ColaboradorListItem | null>(null);
  const [reactivarLoading, setReactivarLoading] = React.useState(false);

  const cargarColaboradores = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerColaboradores();
      setColaboradores(data);
    } catch {
      setColaboradores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    cargarColaboradores();
  }, [cargarColaboradores]);

  const handleConfirmarBaja = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colaboradorParaBaja) return;

    if (motivoBaja.trim().length < 3) {
      setBajaError("Debe indicar un motivo de baja de al menos 3 caracteres.");
      return;
    }

    setBajaLoading(true);
    setBajaError(null);

    try {
      const res = await darDeBajaColaborador(Number(colaboradorParaBaja.id), motivoBaja.trim());
      if (res.success) {
        setColaboradorParaBaja(null);
        setMotivoBaja("");
        await cargarColaboradores();
      } else {
        setBajaError(res.mensaje || "Error al dar de baja el colaborador.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado al dar de baja.";
      setBajaError(msg);
    } finally {
      setBajaLoading(false);
    }
  };

  const handleConfirmarReactivar = async () => {
    if (!colaboradorParaReactivar) return;
    setReactivarLoading(true);

    try {
      const res = await reactivarColaborador(Number(colaboradorParaReactivar.id));
      if (res.success) {
        setColaboradorParaReactivar(null);
        await cargarColaboradores();
      }
    } finally {
      setReactivarLoading(false);
    }
  };

  // Métricas
  const totalColaboradores = colaboradores.length;
  const activos = colaboradores.filter((c) => c.estado === "Activo").length;
  const inactivos = totalColaboradores - activos;

  const prestacionesUnicas = React.useMemo(() => {
    const set = new Set(colaboradores.map((c) => c.prestacion).filter(Boolean));
    return Array.from(set).sort();
  }, [colaboradores]);

  const columns: Column<ColaboradorListItem>[] = React.useMemo(
    () => [
      {
        key: "documento",
        header: "Documento",
        accessor: (c) => (
          <div>
            <span className="font-mono font-medium text-foreground">{c.documento}</span>
            <span className="ml-1.5 text-[11px] text-on-surface-variant uppercase">{c.tipoDocumento}</span>
          </div>
        ),
        searchable: true,
        searchAccessor: (c) => c.documento,
      },
      {
        key: "nombre",
        header: "Nombre / Razón Social",
        accessor: (c) => (
          <div>
            <p className="font-semibold text-foreground">
              {c.apellido}, {c.nombre}
            </p>
            {c.razonSocial && (
              <p className="text-xs text-on-surface-variant">{c.razonSocial}</p>
            )}
          </div>
        ),
        searchable: true,
        searchAccessor: (c) =>
          `${c.nombre} ${c.apellido} ${c.razonSocial || ""}`,
      },
      {
        key: "prestacion",
        header: "Servicio Prestado",
        accessor: (c) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {c.prestacion}
          </span>
        ),
        filterable: prestacionesUnicas.length > 0,
        filterOptions: [
          { value: "Todos", label: "Todas las prestaciones" },
          ...prestacionesUnicas.map((p) => ({ value: p, label: p })),
        ],
        filterAccessor: (c) => c.prestacion,
      },
      {
        key: "telefonos",
        header: "Teléfono",
        accessor: (c) => (
          <span className="text-sm font-mono text-on-surface-variant">
            {c.telefonos.length > 0 ? c.telefonos[0] : "-"}
          </span>
        ),
      },
      {
        key: "estado",
        header: "Estado",
        accessor: (c) => (
          <span
            className={cn(
              "inline-flex items-center rounded-[8px] h-8 px-3.5 text-sm font-medium",
              c.estado === "Activo"
                ? "bg-primary-container text-on-primary-container"
                : "bg-destructive text-white font-medium"
            )}
          >
            {c.estado}
          </span>
        ),
        filterable: true,
        filterOptions: ESTADO_OPTIONS,
        filterAccessor: (c) => c.estado,
      },
    ],
    [prestacionesUnicas]
  );

  return (
    <div className="relative h-full p-4 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Listado de Colaboradores</h1>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          interactive={false}
          className="p-5 flex flex-col items-center justify-center text-center rounded-2xl border-0 shadow-none bg-rose-400 text-white"
        >
          <p className="text-3xl font-bold tracking-tight">{totalColaboradores}</p>
          <p className="text-xs font-medium mt-1 text-white/90">Total Colaboradores</p>
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

      {/* Tabla de Colaboradores */}
      <DataTable<ColaboradorListItem>
        storageKey="colaboradores-list"
        data={colaboradores}
        columns={columns}
        getRowId={(c) => c.id}
        searchPlaceholder="Buscar por nombre, documento o razón social..."
        loading={loading}
        emptyMessage="No se encontraron colaboradores"
        onRowClick={(c) => router.push(`/dashboard/colaboradores/${c.id}`)}
        renderActions={(c) =>
          c.estado === "Inactivo" ? (
            <Button
              variant="ghost"
              size="icon"
              title="Reactivar"
              aria-label={`Reactivar colaborador ${c.nombre}`}
              onClick={() => setColaboradorParaReactivar(c)}
            >
              <UserCheck />
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                title="Editar"
                aria-label={`Editar colaborador ${c.nombre}`}
                onClick={() => router.push(`/dashboard/colaboradores/${c.id}`)}
              >
                <Edit />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Dar de baja"
                aria-label={`Dar de baja colaborador ${c.nombre}`}
                className="text-destructive"
                onClick={() => {
                  setColaboradorParaBaja(c);
                  setMotivoBaja("");
                  setBajaError(null);
                }}
              >
                <Trash2 />
              </Button>
            </>
          )
        }
      />

      <Link
        href="/dashboard/colaboradores/nuevo"
        className={cn(
          fabVariants({ variant: "primary", size: "large" }),
          "fixed bottom-8 right-8"
        )}
        aria-label="Nuevo colaborador"
      >
        <Plus />
      </Link>

      {/* Modal de Baja con Motivo */}
      <Dialog
        open={colaboradorParaBaja !== null}
        onOpenChange={(open) => !open && setColaboradorParaBaja(null)}
      >
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleConfirmarBaja}>
            <DialogHeader>
              <DialogTitle>Dar de Baja Colaborador</DialogTitle>
              <DialogDescription>
                Indique el motivo por el cual da de baja a{" "}
                <span className="font-semibold text-foreground">
                  {colaboradorParaBaja?.apellido}, {colaboradorParaBaja?.nombre}
                </span>.
              </DialogDescription>
            </DialogHeader>

            {bajaError && (
              <p className="text-xs text-destructive mt-2">{bajaError}</p>
            )}

            <div className="space-y-2 py-4">
              <Label htmlFor="motivo-baja">Motivo de Baja</Label>
              <Input
                id="motivo-baja"
                type="text"
                placeholder="Ej: Cese de actividad, finalización de convenio..."
                value={motivoBaja}
                onChange={(e) => setMotivoBaja(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setColaboradorParaBaja(null)}
                disabled={bajaLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={bajaLoading}
              >
                {bajaLoading ? "Procesando..." : "Confirmar Baja"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ConfirmDialog de Reactivación */}
      <ConfirmDialog
        open={colaboradorParaReactivar !== null}
        onOpenChange={(open) => !open && setColaboradorParaReactivar(null)}
        title="Reactivar Colaborador"
        description={`¿Desea reactivar al colaborador ${colaboradorParaReactivar?.apellido}, ${colaboradorParaReactivar?.nombre}? Volverá a figurar con estado Activo.`}
        confirmText="Reactivar"
        loading={reactivarLoading}
        onConfirm={handleConfirmarReactivar}
      />
    </div>
  );
}
