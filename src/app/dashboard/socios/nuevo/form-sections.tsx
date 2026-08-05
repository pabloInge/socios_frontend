"use client"

import * as React from "react"
import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form"
import { Plus, Search, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Chip } from "@/components/ui/chip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Fab } from "@/components/ui/fab"
import { MOCK_CIUDADES } from "@/lib/ciudades"
import { MOCK_OBRAS_SOCIALES, type ObraSocial } from "@/lib/obras-sociales"

import type { SocioFormData } from "./schema"
import { contactValue } from "./schema"

const OBRAS_SOCIALES_COLUMNS: Column<ObraSocial>[] = [
  { key: "id", header: "Id", accessor: (o) => o.id, searchable: true },
  { key: "nombre", header: "Nombre", accessor: (o) => o.nombre, searchable: true },
]

interface DocumentoFieldProps {
  register: UseFormRegister<SocioFormData>
  errors: FieldErrors<SocioFormData>
  isVerificado: boolean
  isEdit: boolean
  loadingSearch: boolean
  onBuscar: () => void
  onCancelar: () => void
  onCambiarDocumento: () => void
}

export function DocumentoField({
  register,
  errors,
  isVerificado,
  isEdit,
  loadingSearch,
  onBuscar,
  onCancelar,
  onCambiarDocumento,
}: DocumentoFieldProps) {
  return (
    <>
      <div className="col-span-12 md:col-span-10">
        <Input
          label="Documento"
          variant="outlined"
          error={!!errors.nroDocumento}
          errorText={errors.nroDocumento?.message}
          {...register("nroDocumento")}
          readOnly={isVerificado}
        />
      </div>

      <div className="col-span-12 md:col-span-2 flex items-start gap-3">
        {!isVerificado ? (
          <>
            <Fab
              type="button"
              onClick={onBuscar}
              disabled={loadingSearch}
              icon={<Search />}
              aria-label="Buscar"
            />
            <Fab
              type="button"
              variant="surface"
              onClick={onCancelar}
              icon={<X />}
              aria-label="Cancelar"
            />
          </>
        ) : (
          !isEdit && (
            <Button
              type="button"
              variant="outline"
              className="w-full h-14"
              onClick={onCambiarDocumento}
            >
              Buscar otro
            </Button>
          )
        )}
      </div>
    </>
  )
}

interface DatosPersonalesFieldsProps {
  register: UseFormRegister<SocioFormData>
  errors: FieldErrors<SocioFormData>
  setValue: UseFormSetValue<SocioFormData>
  ciudadValue: string | undefined
  editId: string | null
}

export function DatosPersonalesFields({
  register,
  errors,
  setValue,
  ciudadValue,
  editId,
}: DatosPersonalesFieldsProps) {
  const ciudadOptions =
    ciudadValue && !MOCK_CIUDADES.some((c) => c.nombre === ciudadValue)
      ? [...MOCK_CIUDADES, { id: "externo", nombre: ciudadValue }]
      : MOCK_CIUDADES

  return (
    <>
      <div className="col-span-12 md:col-span-2">
        <Input
          label="Id socio"
          value={editId || "1024"}
          readOnly
          variant="outlined"
        />
      </div>

      <div className="col-span-12 md:col-span-5">
        <Input
          label="Nombre"
          variant="outlined"
          error={!!errors.nombre}
          errorText={errors.nombre?.message}
          {...register("nombre")}
        />
      </div>

      <div className="col-span-12 md:col-span-5">
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
          label="Fecha de nacimiento"
          type="date"
          variant="outlined"
          error={!!errors.fechaNacimiento}
          errorText={errors.fechaNacimiento?.message}
          {...register("fechaNacimiento")}
        />
      </div>

      <div className="col-span-12 md:col-span-6">
        <Select
          value={ciudadValue || ""}
          onValueChange={(val) => setValue("ciudad", val, { shouldValidate: true })}
        >
          <SelectTrigger label="Ciudad" variant="outlined" error={!!errors.ciudad}>
            <SelectValue placeholder=" " />
          </SelectTrigger>
          <SelectContent>
            {ciudadOptions.map((c) => (
              <SelectItem key={c.id} value={c.nombre}>
                {c.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.ciudad && <p className="text-xs text-destructive mt-1 px-4">{errors.ciudad.message}</p>}
      </div>

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
    </>
  )
}

interface FechasEstadoFieldsProps {
  register: UseFormRegister<SocioFormData>
  errors: FieldErrors<SocioFormData>
}

export function FechasEstadoFields({ register, errors }: FechasEstadoFieldsProps) {
  return (
    <>
      <div className="col-span-12 md:col-span-4">
        <Input
          label="Fecha de alta"
          type="date"
          variant="outlined"
          error={!!errors.fechaAlta}
          errorText={errors.fechaAlta?.message}
          {...register("fechaAlta")}
        />
      </div>

      <div className="col-span-12 md:col-span-4">
        <Input
          label="Fecha de baja"
          type="date"
          variant="outlined"
          error={!!errors.fechaBaja}
          errorText={errors.fechaBaja?.message}
          {...register("fechaBaja")}
        />
      </div>

      <div className="col-span-12 md:col-span-4">
        <Input
          label="Estado"
          value="Activo"
          readOnly
          variant="outlined"
        />
      </div>
    </>
  )
}

interface ObraSocialFieldsProps {
  setValue: UseFormSetValue<SocioFormData>
  errors: FieldErrors<SocioFormData>
  obraSocialValue: string | undefined
  planValue: string | undefined
  sepelioValue: string | undefined
  cobradorValue: string | undefined
}

export function ObraSocialFields({
  setValue,
  errors,
  obraSocialValue,
  planValue,
  sepelioValue,
  cobradorValue,
}: ObraSocialFieldsProps) {
  return (
    <>
      <div className="col-span-12 md:col-span-6 flex flex-col sm:flex-row items-start sm:items-end gap-2">
        <div className="flex-grow w-full">
          <Input
            label="Obra Social"
            value={obraSocialValue || "Ninguna seleccionada"}
            readOnly
            variant="outlined"
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="w-full sm:w-auto h-14" size="default">
              <Search className="size-4" />
              Seleccionar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Buscar obra social</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <DataTable<ObraSocial>
                storageKey="obras-sociales-selector"
                data={MOCK_OBRAS_SOCIALES}
                columns={OBRAS_SOCIALES_COLUMNS}
                getRowId={(o) => o.id}
                searchPlaceholder="Buscar obra social por id o nombre"
                emptyMessage="No se encontraron obras sociales"
                columnsLabel="Columnas"
                renderActions={(os) => (
                  <DialogClose asChild>
                    <Button
                      size="sm"
                      onClick={() => setValue("obraSocial", os.nombre)}
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

      <div className="col-span-12 md:col-span-3 lg:col-span-2">
        <Select
          value={planValue || ""}
          onValueChange={(val) => setValue("plan", val, { shouldValidate: true })}
        >
          <SelectTrigger label="Plan" variant="outlined" error={!!errors.plan}>
            <SelectValue placeholder=" " />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">Plan A</SelectItem>
            <SelectItem value="B">Plan B</SelectItem>
          </SelectContent>
        </Select>
        {errors.plan && <p className="text-xs text-destructive mt-1 px-4">{errors.plan.message}</p>}
      </div>

      <div className="col-span-12 md:col-span-3 lg:col-span-2">
        <Select
          value={sepelioValue || "NO"}
          onValueChange={(val) => setValue("sepelio", val)}
        >
          <SelectTrigger label="Sepelio" variant="outlined">
            <SelectValue placeholder=" " />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SI">SI</SelectItem>
            <SelectItem value="NO">NO</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-12 md:col-span-3 lg:col-span-2">
        <Select
          value={cobradorValue || "NO"}
          onValueChange={(val) => setValue("cobrador", val, { shouldValidate: true })}
        >
          <SelectTrigger label="Cobrador" variant="outlined" error={!!errors.cobrador}>
            <SelectValue placeholder=" " />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SI">SI</SelectItem>
            <SelectItem value="NO">NO</SelectItem>
          </SelectContent>
        </Select>
        {errors.cobrador && <p className="text-xs text-destructive mt-1 px-4">{errors.cobrador.message}</p>}
      </div>
    </>
  )
}

interface ContactosFieldsProps {
  control: Control<SocioFormData>
  errors: FieldErrors<SocioFormData>
}

export function ContactosFields({ control, errors }: ContactosFieldsProps) {
  const { fields: telefonoFields, append: appendTelefono, remove: removeTelefono } = useFieldArray({
    control,
    name: "telefonos",
  })

  const { fields: correoFields, append: appendCorreo, remove: removeCorreo } = useFieldArray({
    control,
    name: "correos",
  })

  const [newTelefono, setNewTelefono] = React.useState("")
  const [newCorreo, setNewCorreo] = React.useState("")
  const [telefonoError, setTelefonoError] = React.useState("")
  const [correoError, setCorreoError] = React.useState("")

  const handleAddTelefono = () => {
    if (!newTelefono) return
    if (!/^\d{8,15}$/.test(newTelefono.replace(/[- ]/g, ""))) {
      setTelefonoError("Formato inválido")
      return
    }
    setTelefonoError("")
    appendTelefono({ value: newTelefono })
    setNewTelefono("")
  }

  const handleAddCorreo = () => {
    if (!newCorreo) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCorreo)) {
      setCorreoError("Formato de correo inválido")
      return
    }
    setCorreoError("")
    appendCorreo({ value: newCorreo })
    setNewCorreo("")
  }

  return (
    <div className="col-span-12 mt-6">
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
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTelefono(); } }}
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
          {errors.telefonos && <p className="text-xs text-destructive px-4">{errors.telefonos.message}</p>}
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
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddCorreo(); } }}
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
          {errors.correos && <p className="text-xs text-destructive px-4">{errors.correos.message}</p>}
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
  )
}

interface FormFooterProps {
  isEdit: boolean
  onIrAlListado: () => void
  onBuscarOtro: () => void
}

export function FormFooter({ isEdit, onIrAlListado, onBuscarOtro }: FormFooterProps) {
  return (
    <div className="col-span-12 flex flex-col md:flex-row justify-end gap-4 mt-10">
      <Button
        type="button"
        variant="outline"
        className="w-full md:w-40"
        onClick={isEdit ? onIrAlListado : onBuscarOtro}
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        className="w-full md:w-40"
      >
        <Check className="size-4" />
        Grabar
      </Button>
    </div>
  )
}
