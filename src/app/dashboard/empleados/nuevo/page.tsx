"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Check, Search, X } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chip } from "@/components/ui/chip";
import { Separator } from "@/components/ui/separator";
import { Fab } from "@/components/ui/fab";
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
import {
  empleadoSchema,
  type EmpleadoFormData,
  normalizeContacts,
  type ContactField,
} from "../schema";
import {
  crearEmpleado,
  buscarEmpleadoPorDocumento,
} from "../actions";

const CIUDADES_COLUMNS: Column<Ciudad>[] = [
  { key: "nombre", header: "Nombre", accessor: (c) => c.nombre, searchable: true },
];

function contactValue(item: ContactField): string {
  return typeof item === "string" ? item : item.value;
}

export default function NuevoEmpleadoPage() {
  const router = useRouter();

  const [isVerificado, setIsVerificado] = React.useState(false);
  const [loadingSearch, setLoadingSearch] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    trigger,
    setError,
    formState: { errors },
  } = useForm<EmpleadoFormData>({
    resolver: zodResolver(empleadoSchema) as Resolver<EmpleadoFormData>,
    defaultValues: {
      dni: "",
      nombre: "",
      apellido: "",
      sexo: "Masculino",
      fechaNacimiento: new Date().toISOString().substring(0, 10),
      ciudad: "",
      calle: "",
      altura: "",
      observaciones: "",
      telefonos: [],
      correos: [],
    },
  });

  const dniValue = useWatch({ control, name: "dni" });
  const sexoValue = useWatch({ control, name: "sexo" });
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

  const handleVerificarDocumento = async () => {
    const isValid = await trigger("dni");
    if (!isValid) return;

    setLoadingSearch(true);

    try {
      const entidad = await buscarEmpleadoPorDocumento(dniValue);
      if (entidad) {
        const formattedTelefonos = (entidad.telefonos || []).map((t) =>
          typeof t === "string" ? { value: t } : t
        );
        const formattedCorreos = (entidad.correos || []).map((c) =>
          typeof c === "string" ? { value: c } : c
        );

        reset({
          dni: entidad.dni || dniValue,
          nombre: entidad.nombre || "",
          apellido: entidad.apellido || "",
          sexo: entidad.sexo || "Masculino",
          fechaNacimiento: entidad.fechaNacimiento || new Date().toISOString().substring(0, 10),
          ciudad: entidad.ciudad || "",
          calle: entidad.calle || "",
          altura: entidad.altura || "",
          observaciones: entidad.observaciones || "",
          telefonos: formattedTelefonos,
          correos: formattedCorreos,
        });
      } else {
        reset({
          dni: dniValue,
          nombre: "",
          apellido: "",
          sexo: "Masculino",
          fechaNacimiento: new Date().toISOString().substring(0, 10),
          ciudad: "",
          calle: "",
          altura: "",
          observaciones: "",
          telefonos: [],
          correos: [],
        });
      }
      setIsVerificado(true);
    } catch (err) {
      setError("dni", {
        type: "manual",
        message: "Error al buscar el empleado. Intente nuevamente.",
      });
      console.error(err);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleCambiarDocumento = () => {
    setIsVerificado(false);
    reset({
      dni: "",
      nombre: "",
      apellido: "",
      sexo: "Masculino",
      fechaNacimiento: new Date().toISOString().substring(0, 10),
      ciudad: "",
      calle: "",
      altura: "",
      observaciones: "",
      telefonos: [],
      correos: [],
    });
  };

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

  const onSubmit = async (data: EmpleadoFormData) => {
    setSubmitting(true);

    const formattedData: EmpleadoFormData = {
      ...data,
      telefonos: normalizeContacts(data.telefonos),
      correos: normalizeContacts(data.correos),
    };

    try {
      const res = await crearEmpleado(formattedData);
      if (!res.success) {
        throw new Error(res.mensaje || "No se pudo crear el empleado.");
      }
      router.push("/dashboard/empleados");
    } catch (err: unknown) {
      console.error("Error al guardar el empleado:", err);
      const msg = err instanceof Error ? err.message : "Error al guardar el empleado";
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
    <div className="min-h-screen bg-surface-container-lowest text-on-surface p-4 md:p-8 flex justify-center items-start">
      <Card
        variant="outlined"
        className="w-full max-w-6xl p-6 md:p-10 bg-background"
        style={{ "--input-bg": "var(--color-surface-container-lowest)" } as React.CSSProperties}
      >
        <h1 className="text-2xl mb-8 font-semibold tracking-tight">
          Nuevo empleado
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-x-6 gap-y-8">
          {/* Documento Search Field */}
          <div className="col-span-12 md:col-span-10">
            <Input
              label="DNI (7 u 8 dígitos)"
              variant="outlined"
              error={!!errors.dni}
              errorText={errors.dni?.message}
              {...register("dni")}
              readOnly={isVerificado}
            />
          </div>

          {/* Action Buttons for Document Step */}
          <div className="col-span-12 md:col-span-2 flex items-start gap-3">
            {!isVerificado ? (
              <>
                <Fab
                  type="button"
                  onClick={handleVerificarDocumento}
                  disabled={loadingSearch}
                  icon={<Search />}
                  aria-label="Buscar"
                />
                <Fab
                  type="button"
                  variant="surface"
                  onClick={() => router.push("/dashboard/empleados")}
                  icon={<X />}
                  aria-label="Cancelar"
                />
              </>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full h-14"
                onClick={handleCambiarDocumento}
              >
                Buscar otro
              </Button>
            )}
          </div>

          {isVerificado && (
            <>
              {/* Nombre y Apellido */}
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

              {/* Sexo */}
              <div className="col-span-12 md:col-span-6">
                <Select
                  value={sexoValue}
                  onValueChange={(val) => setValue("sexo", val, { shouldValidate: true })}
                >
                  <SelectTrigger label="Sexo" variant="outlined">
                    <SelectValue placeholder="Seleccionar sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fecha Inicio / Nacimiento */}
              <div className="col-span-12 md:col-span-6">
                <Input
                  label="Fecha de nacimiento"
                  type="date"
                  variant="outlined"
                  error={!!errors.fechaNacimiento}
                  errorText={errors.fechaNacimiento?.message}
                  {...register("fechaNacimiento")}
                />
              </div>

              {/* Ciudad con selector modal */}
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
                        storageKey="empleados-ciudades-selector"
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

              {/* Calle y Altura */}
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

              {/* Observaciones */}
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

              {/* Contactos */}
              <div className="col-span-12">
                <h2 className="text-xl mb-4 font-medium">Contactos</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Teléfonos */}
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

                  {/* Correos */}
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

              {/* Botones de acción */}
              <div className="col-span-12 flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/empleados")}
                >
                  Volver al listado
                </Button>
                <Button type="submit" disabled={submitting}>
                  <Check className="size-4" />
                  {submitting ? "Guardando..." : "Guardar empleado"}
                </Button>
              </div>
            </>
          )}
        </form>
      </Card>
    </div>
  );
}
