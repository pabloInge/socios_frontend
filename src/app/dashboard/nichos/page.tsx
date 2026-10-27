"use client";

import * as React from "react";
import { Plus, Trash2, UserPlus } from "lucide-react";

import { DataTable, type Column } from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { fabVariants } from "@/components/ui/fab";
import { cn } from "@/lib/utils";
import { type NichoItem } from "./schema";
import { obtenerNichos, darDeBajaNicho } from "./actions";
import { CrearNichoDialog } from "./crear-nicho-dialog";
import { AsignarNichoDialog } from "./asignar-nicho-dialog";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function NichosPage() {
  const [nichos, setNichos] = React.useState<NichoItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Modales
  const [modalCrearOpen, setModalCrearOpen] = React.useState(false);
  const [nichoParaAsignar, setNichoParaAsignar] = React.useState<NichoItem | null>(null);
  const [nichoParaEliminar, setNichoParaEliminar] = React.useState<NichoItem | null>(null);
  const [eliminando, setEliminando] = React.useState(false);

  const cargarNichos = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerNichos();
      setNichos(data);
    } catch {
      setNichos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    cargarNichos();
  }, [cargarNichos]);

  const handleConfirmarBaja = async () => {
    if (!nichoParaEliminar) return;

    setEliminando(true);
    try {
      const res = await darDeBajaNicho(Number(nichoParaEliminar.id));
      if (res.success) {
        setNichoParaEliminar(null);
        await cargarNichos();
      }
    } finally {
      setEliminando(false);
    }
  };

  // Cálculos para tarjetas de métricas
  const totalNichos = nichos.length;
  const ocupados = nichos.filter((n) => n.ocupado).length;
  const disponibles = totalNichos - ocupados;

  const sectoresUnicos = React.useMemo(() => {
    const set = new Set(nichos.map((n) => n.sector).filter(Boolean));
    return Array.from(set).sort();
  }, [nichos]);

  const columns: Column<NichoItem>[] = [
    {
      key: "sector",
      header: "Sector",
      accessor: (n) => <span className="font-semibold text-foreground">Sector {n.sector}</span>,
      searchable: true,
      searchAccessor: (n) => `Sector ${n.sector}`,
      filterable: sectoresUnicos.length > 0,
      filterOptions: [
        { value: "Todos", label: "Todos los sectores" },
        ...sectoresUnicos.map((s) => ({ value: s, label: `Sector ${s}` })),
      ],
      filterAccessor: (n) => n.sector,
    },
    {
      key: "nroNicho",
      header: "N° Nicho",
      accessor: (n) => `#${n.nroNicho}`,
      searchable: true,
      searchAccessor: (n) => String(n.nroNicho),
      className: "font-mono font-medium",
    },
    {
      key: "ocupado",
      header: "Estado",
      accessor: (n) => (
        <span
          className={cn(
            "inline-flex items-center rounded-[8px] h-8 px-3.5 text-sm font-medium",
            n.ocupado
              ? "bg-primary-container text-on-primary-container"
              : "bg-surface-variant text-on-surface-variant font-medium"
          )}
        >
          {n.ocupado ? "Ocupado" : "Disponible"}
        </span>
      ),
      filterable: true,
      filterOptions: [
        { value: "Todos", label: "Todos los estados" },
        { value: "Ocupado", label: "Ocupado" },
        { value: "Disponible", label: "Disponible" },
      ],
      filterAccessor: (n) => (n.ocupado ? "Ocupado" : "Disponible"),
    },
    {
      key: "socio",
      header: "Titular Asignado",
      accessor: (n) =>
        n.socio ? (
          <span className="font-medium text-foreground">
            {n.socio.apellido ? `${n.socio.apellido}, ${n.socio.nombre}` : n.socio.nombre}
          </span>
        ) : (
          <span className="text-on-surface-variant italic">Sin asignar</span>
        ),
      searchable: true,
      searchAccessor: (n) =>
        n.socio ? `${n.socio.nombre} ${n.socio.apellido}` : "",
    },
    {
      key: "valorNicho",
      header: "Valor Nicho",
      accessor: (n) => (n.valorNicho > 0 ? formatCurrency(n.valorNicho) : "-"),
      className: "tabular-nums",
    },
    {
      key: "valorLapida",
      header: "Valor Lápida",
      accessor: (n) => (n.valorLapida > 0 ? formatCurrency(n.valorLapida) : "-"),
      className: "tabular-nums",
    },
    {
      key: "cuotas",
      header: "Financiación",
      accessor: (n) =>
        n.cuotas > 0
          ? `${n.cuotas} cuotas (${(n.interes * 100).toFixed(0)}% int.)`
          : n.ocupado
          ? "Contado"
          : "-",
      className: "text-xs text-on-surface-variant",
    },
  ];

  return (
    <div className="relative h-full p-4 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Nichos</h1>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          interactive={false}
          className="p-5 flex flex-col items-center justify-center text-center rounded-2xl border-0 shadow-none bg-rose-400 text-white"
        >
          <p className="text-3xl font-bold tracking-tight">{totalNichos}</p>
          <p className="text-xs font-medium mt-1 text-white/90">Total de Nichos</p>
        </Card>

        <Card
          interactive={false}
          className="p-5 flex flex-col items-center justify-center text-center rounded-2xl border-0 shadow-none bg-sky-500 text-white"
        >
          <p className="text-3xl font-bold tracking-tight">{ocupados}</p>
          <p className="text-xs font-medium mt-1 text-white/90">Ocupados / Concesionados</p>
        </Card>

        <Card
          interactive={false}
          className="p-5 flex flex-col items-center justify-center text-center rounded-2xl border-0 shadow-none bg-violet-400 text-white"
        >
          <p className="text-3xl font-bold tracking-tight">{disponibles}</p>
          <p className="text-xs font-medium mt-1 text-white/90">Disponibles</p>
        </Card>
      </div>

      {/* Tabla de Nichos */}
      <DataTable<NichoItem>
        storageKey="nichos-table"
        data={nichos}
        columns={columns}
        getRowId={(n) => n.id}
        loading={loading}
        searchPlaceholder="Buscar por socio, número de nicho o sector..."
        emptyMessage={loading ? "Cargando nichos..." : "No se encontraron nichos"}
        renderActions={(n) =>
          !n.ocupado ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                title="Asignar"
                aria-label={`Asignar nicho ${n.nroNicho}`}
                onClick={() => setNichoParaAsignar(n)}
              >
                <UserPlus />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Eliminar"
                aria-label={`Eliminar nicho ${n.nroNicho}`}
                className="text-destructive"
                onClick={() => setNichoParaEliminar(n)}
              >
                <Trash2 />
              </Button>
            </>
          ) : (
            <span className="text-xs text-on-surface-variant/70 italic px-2">Concesionado</span>
          )
        }
      />

      <button
        type="button"
        onClick={() => setModalCrearOpen(true)}
        className={cn(
          fabVariants({ variant: "primary", size: "large" }),
          "fixed bottom-8 right-8"
        )}
        aria-label="Nuevo nicho"
      >
        <Plus />
      </button>

      {/* Modal de Creación */}
      <CrearNichoDialog
        open={modalCrearOpen}
        onOpenChange={setModalCrearOpen}
        onSuccess={cargarNichos}
      />

      {/* Modal de Asignación */}
      <AsignarNichoDialog
        open={nichoParaAsignar !== null}
        nicho={nichoParaAsignar}
        onOpenChange={(open) => !open && setNichoParaAsignar(null)}
        onSuccess={cargarNichos}
      />

      {/* Confirmación de Baja */}
      <ConfirmDialog
        open={nichoParaEliminar !== null}
        onOpenChange={(open) => !open && setNichoParaEliminar(null)}
        title="Eliminar Nicho"
        description={`¿Está seguro de que desea eliminar el nicho #${nichoParaEliminar?.nroNicho} del Sector ${nichoParaEliminar?.sector}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
        loading={eliminando}
        onConfirm={handleConfirmarBaja}
      />
    </div>
  );
}
