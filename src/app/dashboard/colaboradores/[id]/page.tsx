"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray, useWatch, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Edit2, Check, X, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { DataTable, type Column } from "@/components/ui/data-table";
import { MOCK_CIUDADES, type Ciudad } from "@/lib/ciudades";
import { MOCK_PRESTACIONES } from "@/lib/prestaciones";
import {
  colaboradorSchema,
  type ColaboradorDetalle,
  type ColaboradorFormData,
  normalizeContacts,
  type ContactField,
} from "../schema";
import { obtenerColaboradorDetalle, modificarColaborador } from "../actions";

const CIUDADES_COLUMNS: Column<Ciudad>[] = [
  { key: "nombre", header: "Nombre", accessor: (c) => c.nombre, searchable: true },
];

function contactValue(item: ContactField): string {
  return typeof item === "string" ? item : item.value;
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card variant="filled">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        {children}
      </CardContent>
    </Card>
  );
}

function FieldRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold tracking-widest text-on-surface-variant/60 mb-1.5">{label}</p>
      <p className="text-base font-medium text-foreground break-words">{value || "—"}</p>
    </div>
  );
}

export function ColaboradorDetalleCard({
  colaborador,
  onEditar,
}: {
  colaborador: ColaboradorDetalle;
  onEditar?: () => void;
}) {
  const isInactivo = colaborador.estado === "Inactivo";

  return (
    <div className="space-y-8 mb-8">
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1.5">
              <CardTitle className="text-3xl">
                {colaborador.razonSocial
                  ? colaborador.razonSocial
                  : `${colaborador.apellido}, ${colaborador.nombre}`}
              </CardTitle>
              <p className="text-base text-on-surface-variant">
                {colaborador.tipoDocumento} {colaborador.documento}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={
                  isInactivo
                    ? "inline-flex items-center rounded-[8px] h-8 px-3.5 text-sm bg-destructive text-white font-medium"
                    : "inline-flex items-center rounded-[8px] h-8 px-3.5 text-sm bg-primary-container text-on-primary-container font-medium"
                }
              >
                {colaborador.estado}
              </span>
              {onEditar && (
                <Button variant="outline" size="sm" onClick={onEditar}>
                  <Edit2 className="size-4" />
                  Editar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="flex flex-wrap gap-x-10 gap-y-3">
            <FieldRow label="ID" value={String(colaborador.id)} />
            <FieldRow label="Tipo Doc" value={colaborador.tipoDocumento} />
            <FieldRow label="Fecha Nacimiento / Inicio" value={colaborador.fechaNacimiento} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SectionCard title="Dirección">
          <FieldRow label="Ciudad" value={colaborador.ciudad} />
          <FieldRow label="Calle" value={colaborador.calle} />
          <FieldRow label="Altura" value={colaborador.altura} />
        </SectionCard>

        <SectionCard title="Servicios y Prestaciones">
          <FieldRow label="Prestación / Servicio" value={colaborador.prestacion} />
        </SectionCard>
      </div>

      <Separator />

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        {colaborador.telefonos && colaborador.telefonos.length > 0 ? (
          <div className="space-y-1.5 min-w-0">
            <p className="text-xs font-bold tracking-widest text-on-surface-variant/60">Teléfonos</p>
            {colaborador.telefonos.map((tel, i) => (
              <p key={i} className="text-base font-medium text-foreground break-words">{tel}</p>
            ))}
          </div>
        ) : (
          <FieldRow label="Teléfonos" value={null} />
        )}
        {colaborador.emails && colaborador.emails.length > 0 ? (
          <div className="space-y-1.5 min-w-0">
            <p className="text-xs font-bold tracking-widest text-on-surface-variant/60">Correos Electrónicos</p>
            {colaborador.emails.map((correo, i) => (
              <p key={i} className="text-base font-medium text-foreground break-words">{correo}</p>
            ))}
          </div>
        ) : (
          <FieldRow label="Correos Electrónicos" value={null} />
        )}
      </section>

      {colaborador.observaciones && (
        <SectionCard title="Observaciones">
          <FieldRow label="Observaciones" value={colaborador.observaciones} />
        </SectionCard>
      )}
    </div>
  );
}

export default function ColaboradorDetallePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [colaborador, setColaborador] = React.useState<ColaboradorDetalle | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(searchParams.get("edit") === "true");
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm<ColaboradorFormData>({
    resolver: zodResolver(colaboradorSchema) as Resolver<ColaboradorFormData>,
    defaultValues: {
      tipoDocumento: "DNI",
      documento: "",
      nombre: "",
      apellido: "",
      razonSocial: "",
      prestacion: "Atención Médica",
      fechaNacimiento: "",
      ciudad: "",
      calle: "",
      altura: "",
      observaciones: "",
      telefonos: [],
      correos: [],
    },
  });

  const prestacionValue = useWatch({ control, name: "prestacion" });
  const ciudadValue = useWatch({ control, name: "ciudad" });

  const {
    fields: telefonoFields,
    append: appendTelefono,
    remove: removeTelefono,
  } = useFieldArray({
    control,
    name: "telefonos",
  });

  const {
    fields: correoFields,
    append: appendCorreo,
    remove: removeCorreo,
  } = useFieldArray({
    control,
    name: "correos",
  });

  const [newTelefono, setNewTelefono] = React.useState("");
  const [newCorreo, setNewCorreo] = React.useState("");
  const [telefonoError, setTelefonoError] = React.useState("");
  const [correoError, setCorreoError] = React.useState("");

  const populateForm = React.useCallback(
    (data: ColaboradorDetalle) => {
      reset({
        tipoDocumento: (data.tipoDocumento === "CUIT" ? "CUIT" : "DNI") as "DNI" | "CUIT",
        documento: data.documento,
        nombre: data.nombre,
        apellido: data.apellido,
        razonSocial: data.razonSocial || "",
        prestacion: data.prestacion,
        fechaNacimiento: data.fechaNacimiento || "",
        ciudad: data.ciudad,
        calle: data.calle,
        altura: data.altura,
        observaciones: data.observaciones || "",
        telefonos: (data.telefonos || []).map((t) => ({ value: t })),
        correos: (data.emails || []).map((e) => ({ value: e })),
      });
    },
    [reset]
  );

  React.useEffect(() => {
    if (!id) return;

    let cancelled = false;
    obtenerColaboradorDetalle(id)
      .then((data) => {
        if (!cancelled && data) {
          setColaborador(data);
          populateForm(data);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, populateForm]);

  const handleAddTelefono = () => {
    if (!newTelefono) return;
    if (!/^\d{8,15}$/.test(newTelefono.replace(/[- ]/g, ""))) {
      setTelefonoError("Formato inválido (8 a 15 dígitos)");
      return;
    }
    setTelefonoError("");
    appendTelefono({ value: newTelefono });
    setNewTelefono("");
  };

  const handleAddCorreo = () => {
    if (!newCorreo) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCorreo)) {
      setCorreoError("Formato de correo inválido");
      return;
    }
    setCorreoError("");
    appendCorreo({ value: newCorreo });
    setNewCorreo("");
  };

  const onSubmit = async (data: ColaboradorFormData) => {
    if (!colaborador) return;
    setSubmitting(true);

    const formattedData: ColaboradorFormData = {
      ...data,
      telefonos: normalizeContacts(data.telefonos),
      correos: normalizeContacts(data.correos),
    };

    try {
      const res = await modificarColaborador(Number(colaborador.id), formattedData);
      if (!res.success) {
        throw new Error(res.mensaje || "Error al modificar colaborador");
      }

      const updatedDetalle: ColaboradorDetalle = {
        ...colaborador,
        nombre: formattedData.nombre,
        apellido: formattedData.apellido,
        razonSocial: formattedData.razonSocial || undefined,
        prestacion: formattedData.prestacion,
        fechaNacimiento: formattedData.fechaNacimiento || "",
        ciudad: formattedData.ciudad,
        calle: formattedData.calle,
        altura: formattedData.altura,
        observaciones: formattedData.observaciones || undefined,
        telefonos: formattedData.telefonos.map(contactValue),
        emails: (formattedData.correos || []).map(contactValue),
      };

      setColaborador(updatedDetalle);
      populateForm(updatedDetalle);
      setIsEditing(false);
    } catch (err: unknown) {
      console.error("Error al actualizar colaborador:", err);
      const msg = err instanceof Error ? err.message : "Error al guardar el colaborador";
      setError("root", {
        type: "manual",
        message: msg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const ciudadOptions =
    ciudadValue && !MOCK_CIUDADES.some((c) => c.nombre === ciudadValue)
      ? [...MOCK_CIUDADES, { id: "externo", nombre: ciudadValue }]
      : MOCK_CIUDADES;

  return (
    <div className="relative min-h-full p-4 md:p-8 pb-16">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon-lg"
          onClick={() => {
            if (isEditing) {
              setIsEditing(false);
            } else {
              router.back();
            }
          }}
          aria-label="Volver"
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? "Editar Colaborador" : "Detalle del Colaborador"}
        </h1>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="rounded-card bg-surface-container-lowest border border-outline-variant p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-7 w-56" />
                <Skeleton className="h-4 w-36" />
              </div>
              <Skeleton className="h-7 w-20 rounded-[8px]" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-7 w-32 rounded-[8px]" />
              <Skeleton className="h-7 w-20 rounded-[8px]" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="rounded-card bg-surface-container-lowest border border-outline-variant p-6 space-y-4"
              >
                <Skeleton className="h-5 w-36" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="space-y-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : colaborador ? (
        isEditing ? (
          <Card
            variant="outlined"
            className="w-full max-w-6xl p-6 md:p-10 bg-background"
            style={{ "--input-bg": "var(--color-surface-container-lowest)" } as React.CSSProperties}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-x-6 gap-y-8">
              <div className="col-span-12 md:col-span-4">
                <Input
                  label="Tipo de documento"
                  variant="outlined"
                  value={colaborador.tipoDocumento}
                  readOnly
                  disabled
                />
              </div>

              <div className="col-span-12 md:col-span-8">
                <Input
                  label="Número de documento"
                  variant="outlined"
                  value={colaborador.documento}
                  readOnly
                  disabled
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <Input
                  label="Nombre"
                  variant="outlined"
                  error={!!errors.nombre}
                  errorText={errors.nombre?.message}
                  {...register("nombre")}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <Input
                  label="Apellido"
                  variant="outlined"
                  error={!!errors.apellido}
                  errorText={errors.apellido?.message}
                  {...register("apellido")}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <Input
                  label="Razón Social (opcional)"
                  variant="outlined"
                  error={!!errors.razonSocial}
                  errorText={errors.razonSocial?.message}
                  {...register("razonSocial")}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <Select
                  value={prestacionValue}
                  onValueChange={(val) => setValue("prestacion", val, { shouldValidate: true })}
                >
                  <SelectTrigger label="Prestación / Servicio" variant="outlined" error={!!errors.prestacion}>
                    <SelectValue placeholder="Seleccionar prestación" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_PRESTACIONES.map((p) => (
                      <SelectItem key={p.id} value={p.nombre}>
                        {p.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.prestacion && (
                  <p className="text-xs text-destructive mt-1 px-4">{errors.prestacion.message}</p>
                )}
              </div>

              <div className="col-span-12 md:col-span-3">
                <Input
                  label="Fecha de inicio / nacimiento"
                  type="date"
                  variant="outlined"
                  error={!!errors.fechaNacimiento}
                  errorText={errors.fechaNacimiento?.message}
                  {...register("fechaNacimiento")}
                />
              </div>

              <div className="col-span-12 md:col-span-9 flex flex-col sm:flex-row items-start sm:items-end gap-2">
                <div className="flex-grow w-full">
                  <Input
                    label="Ciudad"
                    value={ciudadValue || ""}
                    readOnly
                    variant="outlined"
                    error={!!errors.ciudad}
                    onClear={() => setValue("ciudad", "", { shouldValidate: true })}
                  />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="w-full sm:w-auto h-14" size="default" type="button">
                      <Search className="size-4" />
                      Seleccionar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Buscar ciudad</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <DataTable<Ciudad>
                        storageKey="colaboradores-edit-ciudades"
                        data={ciudadOptions}
                        columns={CIUDADES_COLUMNS}
                        getRowId={(c) => c.id}
                        searchPlaceholder="Buscar ciudad por nombre"
                        emptyMessage="No se encontraron ciudades"
                        columnsLabel="Columnas"
                        renderActions={(c) => (
                          <DialogClose asChild>
                            <Button
                              size="sm"
                              type="button"
                              onClick={() => setValue("ciudad", c.nombre, { shouldValidate: true })}
                            >
                              Elegir
                            </Button>
                          </DialogClose>
                        )}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {errors.ciudad && (
                <p className="col-span-12 text-xs text-destructive -mt-6 px-4">{errors.ciudad.message}</p>
              )}

              <div className="col-span-12 md:col-span-9">
                <Input
                  label="Calle"
                  variant="outlined"
                  error={!!errors.calle}
                  errorText={errors.calle?.message}
                  {...register("calle")}
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <Input
                  label="Altura"
                  variant="outlined"
                  error={!!errors.altura}
                  errorText={errors.altura?.message}
                  {...register("altura")}
                />
              </div>

              <div className="col-span-12">
                <Input
                  label="Observaciones (opcional)"
                  variant="outlined"
                  error={!!errors.observaciones}
                  errorText={errors.observaciones?.message}
                  {...register("observaciones")}
                />
              </div>

              <div className="col-span-12 my-2">
                <Separator />
              </div>

              <div className="col-span-12">
                <h2 className="text-xl mb-4 font-medium">Contactos</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2">
                      <div className="flex-grow w-full">
                        <Input
                          label="Teléfono"
                          variant="outlined"
                          value={newTelefono}
                          onChange={(e) => setNewTelefono(e.target.value)}
                          error={!!telefonoError}
                          errorText={telefonoError}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTelefono();
                            }
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full sm:w-auto h-14 px-4"
                        onClick={handleAddTelefono}
                      >
                        <Plus className="size-4" />
                        <span>Agregar</span>
                      </Button>
                    </div>
                    {errors.telefonos && (
                      <p className="text-xs text-destructive px-4">{errors.telefonos.message}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {telefonoFields.map((field, index) => (
                        <Chip
                          key={field.id}
                          variant="input"
                          onRemove={() => removeTelefono(index)}
                        >
                          {contactValue(field)}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2">
                      <div className="flex-grow w-full">
                        <Input
                          label="Correo electrónico"
                          variant="outlined"
                          value={newCorreo}
                          onChange={(e) => setNewCorreo(e.target.value)}
                          error={!!correoError}
                          errorText={correoError}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddCorreo();
                            }
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full sm:w-auto h-14 px-4"
                        onClick={handleAddCorreo}
                      >
                        <Plus className="size-4" />
                        <span>Agregar</span>
                      </Button>
                    </div>
                    {errors.correos && (
                      <p className="text-xs text-destructive px-4">{errors.correos.message}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {correoFields.map((field, index) => (
                        <Chip
                          key={field.id}
                          variant="input"
                          onRemove={() => removeCorreo(index)}
                        >
                          {contactValue(field)}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {errors.root && (
                <div className="col-span-12">
                  <p className="text-sm text-destructive">{errors.root.message}</p>
                </div>
              )}

              <div className="col-span-12 my-4">
                <Separator />
              </div>

              <div className="col-span-12 flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="size-4" />
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  <Check className="size-4" />
                  {submitting ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <ColaboradorDetalleCard
            colaborador={colaborador}
            onEditar={() => setIsEditing(true)}
          />
        )
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8">
          <p className="text-lg font-medium text-on-surface-variant">Colaborador no encontrado</p>
          <p className="text-sm text-on-surface-variant/60 mt-1">
            El colaborador solicitado no existe o ha sido eliminado.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => router.back()}>
            Volver al listado
          </Button>
        </div>
      )}
    </div>
  );
}
