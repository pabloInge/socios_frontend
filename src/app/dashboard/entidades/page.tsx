"use client";

import * as React from "react";
import { Building2, User, Eye, MapPin, Calendar, FileText } from "lucide-react";

import { DataTable, type Column } from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { type EntidadListItem, type EntidadDetalle } from "./schema";
import { buscarEntidades, obtenerEntidadPorDni } from "./actions";

export default function EntidadesPage() {
  const [entidades, setEntidades] = React.useState<EntidadListItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Modal de detalle rápido
  const [detalleEntidad, setDetalleEntidad] = React.useState<EntidadDetalle | null>(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [loadingDetalle, setLoadingDetalle] = React.useState(false);

  const cargarEntidades = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await buscarEntidades();
      setEntidades(data);
    } catch {
      setEntidades([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    cargarEntidades();
  }, [cargarEntidades]);

  const handleVerDetalle = async (item: EntidadListItem) => {
    setOpenModal(true);
    setLoadingDetalle(true);

    try {
      const detalle = await obtenerEntidadPorDni(item.cuitCuil);
      if (detalle) {
        setDetalleEntidad(detalle);
      } else {
        setDetalleEntidad({
          id: item.id,
          cuitCuil: item.cuitCuil,
          nombre: item.nombre,
          apellido: item.apellido,
          razonSocial: item.razonSocial,
          sexo: item.sexo,
          fechaNacimiento: item.fechaNacimiento,
          ciudad: "No especificada",
          calle: "No especificada",
          altura: "",
          tipo: item.tipo,
        });
      }
    } catch {
      setDetalleEntidad(null);
    } finally {
      setLoadingDetalle(false);
    }
  };

  // Métricas
  const total = entidades.length;
  const fisicas = entidades.filter((e) => e.tipo === "Física").length;
  const juridicas = entidades.filter((e) => e.tipo === "Jurídica").length;

  const columns: Column<EntidadListItem>[] = [
    {
      key: "cuitCuil",
      header: "DNI / CUIT / CUIL",
      accessor: (e) => <span className="font-mono font-medium">{e.cuitCuil}</span>,
      searchable: true,
    },
    {
      key: "nombreCompleto",
      header: "Nombre / Razón Social",
      accessor: (e) => (
        <span className="font-medium text-foreground">
          {e.razonSocial ? e.razonSocial : `${e.apellido}, ${e.nombre}`}
        </span>
      ),
      searchable: true,
      searchAccessor: (e) =>
        e.razonSocial
          ? e.razonSocial
          : `${e.nombre} ${e.apellido} ${e.apellido} ${e.nombre}`,
    },
    {
      key: "tipo",
      header: "Tipo",
      accessor: (e) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
            e.tipo === "Jurídica"
              ? "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-300"
              : "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300"
          }`}
        >
          {e.tipo === "Jurídica" ? <Building2 className="size-3.5" /> : <User className="size-3.5" />}
          {e.tipo}
        </span>
      ),
      filterable: true,
      filterOptions: [
        { value: "Todos", label: "Todos los tipos" },
        { value: "Física", label: "Persona Física" },
        { value: "Jurídica", label: "Persona Jurídica" },
      ],
      filterAccessor: (e) => e.tipo,
    },
    {
      key: "sexo",
      header: "Sexo",
      accessor: (e) => e.sexo,
      className: "text-on-surface-variant",
    },
    {
      key: "fechaNacimiento",
      header: "Fecha Nacimiento / Inicio",
      accessor: (e) => e.fechaNacimiento || "-",
      className: "text-on-surface-variant text-xs",
    },
  ];

  return (
    <div className="relative h-full p-4 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Padrón General de Entidades</h1>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          interactive={false}
          className="p-5 flex flex-col items-center justify-center text-center rounded-2xl border-0 shadow-none bg-rose-400 text-white"
        >
          <p className="text-3xl font-bold tracking-tight">{total}</p>
          <p className="text-xs font-medium mt-1 text-white/90">Total de Entidades</p>
        </Card>

        <Card
          interactive={false}
          className="p-5 flex flex-col items-center justify-center text-center rounded-2xl border-0 shadow-none bg-sky-500 text-white"
        >
          <p className="text-3xl font-bold tracking-tight">{fisicas}</p>
          <p className="text-xs font-medium mt-1 text-white/90">Personas Físicas</p>
        </Card>

        <Card
          interactive={false}
          className="p-5 flex flex-col items-center justify-center text-center rounded-2xl border-0 shadow-none bg-violet-400 text-white"
        >
          <p className="text-3xl font-bold tracking-tight">{juridicas}</p>
          <p className="text-xs font-medium mt-1 text-white/90">Personas Jurídicas</p>
        </Card>
      </div>

      {/* Tabla con DataTable */}
      <DataTable<EntidadListItem>
        storageKey="entidades-table"
        data={entidades}
        columns={columns}
        getRowId={(e) => e.id}
        loading={loading}
        searchPlaceholder="Buscar por nombre, apellido, razón social o DNI/CUIT..."
        emptyMessage={loading ? "Buscando entidades..." : "No se encontraron entidades"}
        onRowClick={handleVerDetalle}
        renderActions={(e) => (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Ver ficha"
            title="Ver ficha de domicilio"
            onClick={() => handleVerDetalle(e)}
          >
            <Eye />
          </Button>
        )}
      />

      {/* Modal Ficha Rápida de Entidad */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[500px] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              Ficha de Entidad
            </DialogTitle>
            <DialogDescription className="text-xs text-on-surface-variant">
              Detalle de identificación y domicilio registrado en el padrón.
            </DialogDescription>
          </DialogHeader>

          {loadingDetalle ? (
            <div className="py-8 text-center text-sm text-on-surface-variant animate-pulse">
              Cargando domicilio y datos de la entidad...
            </div>
          ) : detalleEntidad ? (
            <div className="space-y-4 py-2">
              <div className="bg-surface-container-low p-4 rounded-xl space-y-2">
                <p className="text-base font-semibold text-foreground">
                  {detalleEntidad.razonSocial || `${detalleEntidad.nombre} ${detalleEntidad.apellido}`}
                </p>
                <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                  <span>DNI/CUIT: <strong className="text-foreground">{detalleEntidad.cuitCuil}</strong></span>
                  <span>•</span>
                  <span>Tipo: <strong className="text-foreground">{detalleEntidad.tipo}</strong></span>
                </div>
              </div>

              <div className="bg-surface-container-low p-4 rounded-xl space-y-3">
                <div className="flex items-start gap-2.5">
                  <MapPin className="size-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium">Domicilio</p>
                    <p className="text-sm font-medium text-foreground">
                      {detalleEntidad.calle ? `${detalleEntidad.calle} ${detalleEntidad.altura}` : "Sin calle"}
                      {detalleEntidad.ciudad ? `, ${detalleEntidad.ciudad}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar className="size-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium">Fecha Nacimiento / Inicio</p>
                    <p className="text-sm font-medium text-foreground">
                      {detalleEntidad.fechaNacimiento || "No registrada"}
                    </p>
                  </div>
                </div>

                {detalleEntidad.observaciones && (
                  <div className="flex items-start gap-2.5">
                    <FileText className="size-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-on-surface-variant font-medium">Observaciones</p>
                      <p className="text-sm text-foreground">{detalleEntidad.observaciones}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setOpenModal(false)} className="w-full sm:w-auto">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
