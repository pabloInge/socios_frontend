"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray, useWatch, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, X, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { SocioDetalleCard } from "@/components/ui/socio-detalle";
import { useSociosService, type SocioDetalle } from "@/lib/socios/service-context";
import { MOCK_CIUDADES, type Ciudad } from "@/lib/ciudades";
import { MOCK_OBRAS_SOCIALES } from "@/lib/obras-sociales";
import {
  socioSchema,
  type SocioFormData,
  normalizeContacts,
  contactValue,
} from "@/app/dashboard/socios/nuevo/schema";

const CIUDADES_COLUMNS: Column<Ciudad>[] = [
  { key: "nombre", header: "Nombre", accessor: (c) => c.nombre, searchable: true },
];

export default function SocioDetallePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = (Array.isArray(params?.id) ? params.id[0] : params?.id) ?? "";
  const sociosService = useSociosService();

  const [socio, setSocio] = React.useState<SocioDetalle | null>(null);
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
  } = useForm<SocioFormData>({
    resolver: zodResolver(socioSchema) as Resolver<SocioFormData>,
    defaultValues: {
      nombre: "",
      apellido: "",
      nroDocumento: "",
      fechaNacimiento: "",
      sexo: "",
      ciudad: "",
      calle: "",
      altura: "",
      fechaAlta: new Date().toISOString().substring(0, 10),
      plan: "A",
      sepelio: "NO",
      cobrador: "NO",
      observaciones: "",
      telefonos: [],
      correos: [],
    },
  });

  const ciudadValue = useWatch({ control, name: "ciudad" });
  const obraSocialValue = useWatch({ control, name: "obraSocial" });
  const planValue = useWatch({ control, name: "plan" });
  const sepelioValue = useWatch({ control, name: "sepelio" });
  const cobradorValue = useWatch({ control, name: "cobrador" });

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
    (data: SocioDetalle) => {
      reset({
        nombre: data.nombre,
        apellido: data.apellido,
        nroDocumento: data.nroDocumento,
        fechaNacimiento: data.fechaNacimiento,
        sexo: data.sexo || "Hombre",
        ciudad: data.ciudad,
        calle: data.calle,
        altura: data.altura,
        fechaAlta: data.fechaAlta,
        fechaBaja: data.fechaBaja,
        obraSocial: data.obraSocial || "",
        nroAfiliadoObraSocial: data.nroAfiliadoObraSocial || "",
        plan: data.plan || "A",
        sepelio: data.sepelio || "NO",
        cobrador: data.cobrador || "NO",
        observaciones: data.observaciones || "",
        telefonos: (data.telefonos || []).map((t) => ({ value: t })),
        correos: (data.correos || []).map((c) => ({ value: c })),
      });
    },
    [reset]
  );

  React.useEffect(() => {
    let cancelled = false;
    sociosService
      .get(id)
      .then((data) => {
        if (cancelled) return;
        setSocio(data);
        if (data) {
          populateForm(data);
        }
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, sociosService, populateForm]);

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

  const onSubmit = async (data: SocioFormData) => {
    if (!socio) return;
    setSubmitting(true);

    const formattedData: SocioFormData = {
      ...data,
      telefonos: normalizeContacts(data.telefonos),
      correos: normalizeContacts(data.correos),
    };

    try {
      await sociosService.update(id, formattedData);

      const updatedDetalle: SocioDetalle = {
        ...socio,
        ciudad: formattedData.ciudad,
        calle: formattedData.calle,
        altura: formattedData.altura,
        observaciones: formattedData.observaciones || undefined,
        obraSocial: formattedData.obraSocial || undefined,
        nroAfiliadoObraSocial: formattedData.nroAfiliadoObraSocial || undefined,
        plan: formattedData.plan,
        sepelio: formattedData.sepelio,
        cobrador: formattedData.cobrador,
        telefonos: formattedData.telefonos?.map(contactValue) || [],
        correos: formattedData.correos?.map(contactValue) || [],
      };

      setSocio(updatedDetalle);
      populateForm(updatedDetalle);
      setIsEditing(false);
    } catch (err: unknown) {
      console.error("Error al actualizar el socio:", err);
      const msg = err instanceof Error ? err.message : "Error al guardar los cambios del socio";
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
          {isEditing ? "Editar Socio" : "Detalle del Socio"}
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
              <Skeleton className="h-7 w-28 rounded-[8px]" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-card bg-surface-container-lowest border border-outline-variant p-6 space-y-4">
                <Skeleton className="h-5 w-36" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, j) => (
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
      ) : socio ? (
        isEditing ? (
          <Card
            variant="outlined"
            className="w-full max-w-6xl p-6 md:p-10 bg-background"
            style={{ "--input-bg": "var(--color-surface-container-lowest)" } as React.CSSProperties}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-x-6 gap-y-8">
              {/* Datos de Identidad (No editables según SocioModificarDto) */}
              <div className="col-span-12 md:col-span-4">
                <Input
                  label="Documento (DNI)"
                  variant="outlined"
                  value={socio.nroDocumento}
                  readOnly
                  disabled
                />
              </div>

              <div className="col-span-12 md:col-span-4">
                <Input
                  label="Nombre"
                  variant="outlined"
                  value={socio.nombre}
                  readOnly
                  disabled
                />
              </div>

              <div className="col-span-12 md:col-span-4">
                <Input
                  label="Apellido"
                  variant="outlined"
                  value={socio.apellido}
                  readOnly
                  disabled
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <Input
                  label="Sexo"
                  variant="outlined"
                  value={socio.sexo || "—"}
                  readOnly
                  disabled
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <Input
                  label="Fecha de nacimiento"
                  variant="outlined"
                  value={socio.fechaNacimiento}
                  readOnly
                  disabled
                />
              </div>

              <div className="col-span-12 my-2">
                <Separator />
              </div>

              {/* Domicilio editable */}
              <div className="col-span-12">
                <h2 className="text-xl mb-4 font-medium">Domicilio</h2>
              </div>

              {/* Ciudad con selector modal */}
              <div className="col-span-12 md:col-span-6 flex flex-col sm:flex-row items-start sm:items-end gap-2">
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
                        storageKey="socios-edit-ciudades"
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

              <div className="col-span-12 md:col-span-4">
                <Input
                  label="Calle"
                  variant="outlined"
                  error={!!errors.calle}
                  errorText={errors.calle?.message}
                  {...register("calle")}
                />
              </div>

              <div className="col-span-12 md:col-span-2">
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

              {/* Cobertura y Plan */}
              <div className="col-span-12">
                <h2 className="text-xl mb-4 font-medium">Plan y Cobertura</h2>
              </div>

              <div className="col-span-12 md:col-span-4">
                <Select
                  value={obraSocialValue}
                  onValueChange={(val) => setValue("obraSocial", val, { shouldValidate: true })}
                >
                  <SelectTrigger label="Obra Social" variant="outlined">
                    <SelectValue placeholder="Seleccionar obra social" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_OBRAS_SOCIALES.map((os) => (
                      <SelectItem key={os.id} value={os.nombre}>
                        {os.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-12 md:col-span-2">
                <Input
                  label="Nº Afiliado"
                  variant="outlined"
                  error={!!errors.nroAfiliadoObraSocial}
                  errorText={errors.nroAfiliadoObraSocial?.message}
                  {...register("nroAfiliadoObraSocial")}
                />
              </div>

              <div className="col-span-12 md:col-span-2">
                <Select
                  value={planValue}
                  onValueChange={(val) => setValue("plan", val, { shouldValidate: true })}
                >
                  <SelectTrigger label="Plan" variant="outlined">
                    <SelectValue placeholder="Plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Plan A</SelectItem>
                    <SelectItem value="B">Plan B</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-12 md:col-span-2">
                <Select
                  value={sepelioValue}
                  onValueChange={(val) => setValue("sepelio", val, { shouldValidate: true })}
                >
                  <SelectTrigger label="Sepelio" variant="outlined">
                    <SelectValue placeholder="Sepelio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SI">SI</SelectItem>
                    <SelectItem value="NO">NO</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-12 md:col-span-2">
                <Select
                  value={cobradorValue}
                  onValueChange={(val) => setValue("cobrador", val, { shouldValidate: true })}
                >
                  <SelectTrigger label="Cobrador" variant="outlined">
                    <SelectValue placeholder="Cobrador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SI">SI</SelectItem>
                    <SelectItem value="NO">NO</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-12 my-2">
                <Separator />
              </div>

              {/* Contactos */}
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
          <SocioDetalleCard
            socio={socio}
            onEditar={() => setIsEditing(true)}
          />
        )
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8">
          <p className="text-lg font-medium text-on-surface-variant">Socio no encontrado</p>
          <p className="text-sm text-on-surface-variant/60 mt-1">
            El socio solicitado no existe o ha sido eliminado.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => router.back()}>
            Volver al listado
          </Button>
        </div>
      )}
    </div>
  );
}
