"use client"

import * as React from "react"
import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Search, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Chip } from "@/components/ui/chip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"

import { socioSchema, SocioFormData } from "./schema"
import { guardarSocio } from "./actions"

export default function NuevoSocioPage() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SocioFormData>({
    resolver: zodResolver(socioSchema),
    defaultValues: {
      fechaAlta: new Date().toISOString().split("T")[0],
      telefonos: [],
      correos: [],
      plan: "",
      sepelio: "NO",
      cobrador: "NO",
    },
  })

  const { fields: telefonoFields, append: appendTelefono, remove: removeTelefono } = useFieldArray({
    control,
    name: "telefonos" as never,
  })

  const { fields: correoFields, append: appendCorreo, remove: removeCorreo } = useFieldArray({
    control,
    name: "correos" as never,
  })

  const [newTelefono, setNewTelefono] = React.useState("")
  const [newCorreo, setNewCorreo] = React.useState("")
  const [telefonoError, setTelefonoError] = React.useState("")
  const [correoError, setCorreoError] = React.useState("")

  const onSubmit = async (data: SocioFormData) => {
    const formattedData = {
      ...data,
      telefonos: (data.telefonos as unknown as { value: string }[])?.map((t) => t.value || t),
      correos: (data.correos as unknown as { value: string }[])?.map((c) => c.value || c),
    }
    await guardarSocio(formattedData as unknown as SocioFormData)
  }

  const handleAddTelefono = () => {
    if (!newTelefono) return
    if (!/^\d{8,15}$/.test(newTelefono.replace(/[- ]/g, ""))) {
      setTelefonoError("Formato inválido")
      return
    }
    setTelefonoError("")
    appendTelefono({ value: newTelefono } as never)
    setNewTelefono("")
  }

  const handleAddCorreo = () => {
    if (!newCorreo) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCorreo)) {
      setCorreoError("Formato de correo inválido")
      return
    }
    setCorreoError("")
    appendCorreo({ value: newCorreo } as never)
    setNewCorreo("")
  }

  const mockObrasSociales = [
    { id: "1", nombre: "PAMI" },
    { id: "2", nombre: "IAPOS" },
    { id: "3", nombre: "OSDE" },
    { id: "4", nombre: "Jerárquicos Salud" },
  ]

  const selectedObraSocial = useWatch({ control, name: "obraSocial" })
  const planValue = useWatch({ control, name: "plan" })
  const sepelioValue = useWatch({ control, name: "sepelio" })
  const cobradorValue = useWatch({ control, name: "cobrador" })

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface p-4 md:p-8 flex justify-center items-start">
      <Card variant="outlined" className="w-full max-w-6xl p-6 md:p-10 bg-background" style={{ "--input-bg": "var(--color-surface-container-lowest)" } as React.CSSProperties}>
        <h1 className="text-2xl mb-8 font-semibold tracking-tight">
          Nuevo socio
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-x-6 gap-y-8">
          <div className="col-span-12 md:col-span-2">
            <Input
              label="Id socio"
              value="1024"
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

          <div className="col-span-12 md:col-span-4 lg:col-span-4">
            <Input
              label="DNI"
              variant="outlined"
              error={!!errors.dni}
              errorText={errors.dni?.message}
              {...register("dni")}
            />
          </div>

          <div className="col-span-12 md:col-span-4 lg:col-span-4">
            <Input
              label="Fecha de nacimiento"
              type="date"
              variant="outlined"
              error={!!errors.fechaNacimiento}
              errorText={errors.fechaNacimiento?.message}
              {...register("fechaNacimiento")}
            />
          </div>

          <div className="col-span-12 md:col-span-4 lg:col-span-4">
            <Input
              label="Ciudad"
              variant="outlined"
              error={!!errors.ciudad}
              errorText={errors.ciudad?.message}
              {...register("ciudad")}
            />
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

          <div className="col-span-12 my-6">
            <Separator />
          </div>

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

          <div className="col-span-12 md:col-span-6 flex flex-col sm:flex-row items-start sm:items-end gap-2">
            <div className="flex-grow w-full">
              <Input
                label="Obra Social"
                value={selectedObraSocial || "Ninguna seleccionada"}
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
                  <Input label="Nombre de la obra social" variant="outlined" />
                  <div className="rounded-xl border border-outline-variant overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Id</TableHead>
                          <TableHead>Nombre</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockObrasSociales.map((os) => (
                          <TableRow key={os.id}>
                            <TableCell>{os.id}</TableCell>
                            <TableCell>{os.nombre}</TableCell>
                            <TableCell className="text-right">
                              <DialogClose asChild>
                                <Button
                                  size="sm"
                                  onClick={() => setValue("obraSocial", os.nombre)}
                                >
                                  Elegir
                                </Button>
                              </DialogClose>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTelefono(); } }}
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
                      {(field as { value?: string }).value || ""}
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
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCorreo(); } }}
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
                      {(field as { value?: string }).value || ""}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 mt-4">
            <Separator />
          </div>

          <div className="col-span-12 flex flex-col md:flex-row justify-end gap-4 mt-10">
            <Button
              type="button"
              variant="outline"
              className="w-full md:w-40"
              onClick={() => window.location.reload()}
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
        </form>
      </Card>
    </div>
  )
}
