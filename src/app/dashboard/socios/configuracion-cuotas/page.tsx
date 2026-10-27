"use client";

import * as React from "react";
import { Edit, AlertCircle } from "lucide-react";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type ConfiguracionCuotaItem } from "./schema";
import {
  obtenerConfiguracionCuotas,
  modificarImporteSocio,
  modificarSepelioConTope,
  modificarSepelioSinTope,
} from "./actions";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function ConfiguracionCuotasPage() {
  const [cuotas, setCuotas] = React.useState<ConfiguracionCuotaItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingItem, setEditingItem] = React.useState<ConfiguracionCuotaItem | null>(null);

  // Estados del formulario del modal
  const [importeInput, setImporteInput] = React.useState("");
  const [edadTopeInput, setEdadTopeInput] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const cargarCuotas = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerConfiguracionCuotas();
      setCuotas(data);
    } catch {
      setCuotas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    cargarCuotas();
  }, [cargarCuotas]);

  const abrirEdicion = (item: ConfiguracionCuotaItem) => {
    setEditingItem(item);
    setImporteInput(String(item.importe));
    setErrorMsg(null);

    // Si tiene tope de edad ("HASTA 65"), extraer el número
    if (item.edad.toUpperCase().startsWith("HASTA")) {
      const match = item.edad.match(/\d+/);
      setEdadTopeInput(match ? match[0] : "65");
    } else {
      setEdadTopeInput("");
    }
  };

  const cerrarEdicion = () => {
    setEditingItem(null);
    setImporteInput("");
    setEdadTopeInput("");
    setErrorMsg(null);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const importeNum = Number(importeInput);
    if (isNaN(importeNum) || importeNum < 0) {
      setErrorMsg("El importe debe ser un número mayor o igual a 0.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      let res: { success: boolean; mensaje?: string } = { success: false };

      const esSepelioConTope =
        editingItem.concepto.toUpperCase() === "SEPELIO" &&
        editingItem.edad.toUpperCase().startsWith("HASTA");

      const esSepelioSinTope =
        editingItem.concepto.toUpperCase() === "SEPELIO" &&
        editingItem.edad.toUpperCase().startsWith("MAS DE");

      if (esSepelioConTope) {
        const edadTopeNum = Number(edadTopeInput);
        if (isNaN(edadTopeNum) || edadTopeNum <= 0) {
          setErrorMsg("El tope de edad debe ser un número mayor a 0.");
          setSubmitting(false);
          return;
        }
        res = await modificarSepelioConTope({
          id_TipoCuota: editingItem.id_TipoCuota,
          importe: importeNum,
          edadTope: edadTopeNum,
        });
      } else if (esSepelioSinTope) {
        res = await modificarSepelioSinTope({
          id_TipoCuota: editingItem.id_TipoCuota,
          importe: importeNum,
        });
      } else {
        // Concepto SOCIO u otros
        res = await modificarImporteSocio({
          id_TipoCuota: editingItem.id_TipoCuota,
          importe: importeNum,
        });
      }

      if (res.success) {
        cerrarEdicion();
        await cargarCuotas();
      } else {
        setErrorMsg(res.mensaje || "Ocurrió un error al actualizar la cuota.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado al guardar.";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Cálculos para tarjetas de métricas
  const totalCuotas = cuotas.length;
  const cuotaSocio = cuotas.find((c) => c.concepto.toUpperCase() === "SOCIO");
  const sepelioCount = cuotas.filter((c) => c.concepto.toUpperCase() === "SEPELIO").length;

  const conceptosUnicos = React.useMemo(() => {
    const set = new Set(cuotas.map((c) => c.concepto).filter(Boolean));
    return Array.from(set).sort();
  }, [cuotas]);

  const columns: Column<ConfiguracionCuotaItem>[] = [
    {
      key: "concepto",
      header: "Concepto",
      accessor: (c) => {
        const isSocio = c.concepto.toUpperCase() === "SOCIO";
        const isSepelio = c.concepto.toUpperCase() === "SEPELIO";
        const isNicho = c.concepto.toUpperCase() === "NICHO";

        let badgeClass = "bg-primary/10 text-primary";
        if (isSocio) badgeClass = "bg-primary-container text-on-primary-container font-semibold";
        if (isSepelio) badgeClass = "bg-secondary-container text-on-secondary-container font-semibold";
        if (isNicho) badgeClass = "bg-tertiary-container text-on-tertiary-container font-semibold";

        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${badgeClass}`}>
            {c.concepto}
          </span>
        );
      },
      searchable: true,
      searchAccessor: (c) => c.concepto,
      filterable: conceptosUnicos.length > 0,
      filterOptions: [
        { value: "Todos", label: "Todos los conceptos" },
        ...conceptosUnicos.map((concepto) => ({ value: concepto, label: concepto })),
      ],
      filterAccessor: (c) => c.concepto,
    },
    {
      key: "plan",
      header: "Plan",
      accessor: (c) => (
        <span className="font-medium text-foreground">
          {c.plan && c.plan !== "-" ? `Plan ${c.plan}` : "-"}
        </span>
      ),
      searchable: true,
      searchAccessor: (c) => c.plan,
    },
    {
      key: "edad",
      header: "Edad / Tramo",
      accessor: (c) => (
        <span className="text-sm text-on-surface-variant font-mono">
          {c.edad}
        </span>
      ),
      searchable: true,
      searchAccessor: (c) => c.edad,
    },
    {
      key: "importe",
      header: "Importe Cuota",
      accessor: (c) => (
        <span className="font-semibold text-foreground text-sm tabular-nums">
          {formatCurrency(c.importe)}
        </span>
      ),
      className: "tabular-nums",
    },
    {
      key: "ultimaModificacion",
      header: "Última Modificación",
      accessor: (c) => (
        <span className="text-xs text-on-surface-variant">
          {formatDate(c.ultimaModificacion)}
        </span>
      ),
    },
  ];

  const esSepelioConTopeActual =
    editingItem?.concepto.toUpperCase() === "SEPELIO" &&
    editingItem?.edad.toUpperCase().startsWith("HASTA");

  return (
    <div className="relative h-full p-4 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Configuración de Cuotas</h1>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          interactive={false}
          className="p-5 flex flex-col items-center justify-center text-center rounded-2xl border-0 shadow-none bg-rose-400 text-white"
        >
          <p className="text-3xl font-bold tracking-tight">{totalCuotas}</p>
          <p className="text-xs font-medium mt-1 text-white/90">Total de Tipos de Cuota</p>
        </Card>

        <Card
          interactive={false}
          className="p-5 flex flex-col items-center justify-center text-center rounded-2xl border-0 shadow-none bg-sky-500 text-white"
        >
          <p className="text-3xl font-bold tracking-tight">{sepelioCount}</p>
          <p className="text-xs font-medium mt-1 text-white/90">Planes de Sepelio</p>
        </Card>

        <Card
          interactive={false}
          className="p-5 flex flex-col items-center justify-center text-center rounded-2xl border-0 shadow-none bg-violet-400 text-white"
        >
          <p className="text-3xl font-bold tracking-tight">
            {cuotaSocio ? formatCurrency(cuotaSocio.importe) : "-"}
          </p>
          <p className="text-xs font-medium mt-1 text-white/90">Cuota Social Vigente</p>
        </Card>
      </div>

      {/* Tabla de Configuración de Cuotas */}
      <DataTable<ConfiguracionCuotaItem>
        storageKey="configuracion-cuotas-table"
        data={cuotas}
        columns={columns}
        getRowId={(c) => String(c.id_TipoCuota)}
        loading={loading}
        onRowClick={(c) => abrirEdicion(c)}
        searchPlaceholder="Buscar por concepto, plan o tramo..."
        emptyMessage={loading ? "Cargando cuotas..." : "No se encontraron configuraciones de cuota"}
        renderActions={(c) => (
          <Button
            variant="ghost"
            size="icon"
            title="Editar"
            aria-label={`Modificar cuota ${c.concepto} ${c.plan !== "-" ? c.plan : ""}`}
            onClick={() => abrirEdicion(c)}
          >
            <Edit />
          </Button>
        )}
      />

      {/* Modal de Modificación */}
      <Dialog open={editingItem !== null} onOpenChange={(open) => !open && cerrarEdicion()}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleGuardar}>
            <DialogHeader>
              <DialogTitle>Modificar Cuota</DialogTitle>
              <DialogDescription>
                {editingItem ? (
                  <>
                    Actualice los valores para el concepto{" "}
                    <span className="font-semibold text-foreground">{editingItem.concepto}</span>
                    {editingItem.plan !== "-" && ` (Plan ${editingItem.plan})`}.
                  </>
                ) : (
                  "Actualice los valores de la cuota seleccionada."
                )}
              </DialogDescription>
            </DialogHeader>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="importe-input">Importe de la Cuota ($)</Label>
                <Input
                  id="importe-input"
                  type="number"
                  min="0"
                  step="1"
                  value={importeInput}
                  onChange={(e) => setImporteInput(e.target.value)}
                  placeholder="Ej: 5000"
                  required
                />
              </div>

              {esSepelioConTopeActual && (
                <div className="space-y-2">
                  <Label htmlFor="edad-tope-input">Tope de Edad (Años)</Label>
                  <Input
                    id="edad-tope-input"
                    type="number"
                    min="1"
                    max="120"
                    step="1"
                    value={edadTopeInput}
                    onChange={(e) => setEdadTopeInput(e.target.value)}
                    placeholder="Ej: 65"
                    required
                  />
                  <p className="text-xs text-on-surface-variant">
                    Al modificar este tope de edad, el tramo superior ("Más de") del mismo plan se actualizará automáticamente.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={cerrarEdicion}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="default" disabled={submitting}>
                {submitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
