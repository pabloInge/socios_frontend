"use client"

import * as React from "react"
import { useForm, useWatch, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useSociosService, type SocioDetalle } from "@/lib/socios/service-context"

import { socioSchema, SocioFormData, normalizeContacts } from "./schema"
import {
  ContactosFields,
  DatosPersonalesFields,
  DocumentoField,
  FechasEstadoFields,
  FormFooter,
  ObraSocialFields,
} from "./form-sections"

function NuevoSocioForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  const isEdit = Boolean(editId)
  const sociosService = useSociosService()

  const [isVerificado, setIsVerificado] = React.useState(isEdit)
  const [loadingSearch, setLoadingSearch] = React.useState(false)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    trigger,
    setError,
    formState: { errors },
  } = useForm<SocioFormData>({
    resolver: zodResolver(socioSchema) as Resolver<SocioFormData>,
    defaultValues: {
      nroDocumento: "",
      fechaAlta: new Date().toISOString().split("T")[0],
      telefonos: [],
      correos: [],
      plan: "",
      sepelio: "NO",
      cobrador: "NO",
    },
  })

  const nroDocumentoValue = useWatch({ control, name: "nroDocumento" })
  const selectedObraSocial = useWatch({ control, name: "obraSocial" })
  const ciudadValue = useWatch({ control, name: "ciudad" })
  const planValue = useWatch({ control, name: "plan" })
  const sepelioValue = useWatch({ control, name: "sepelio" })
  const cobradorValue = useWatch({ control, name: "cobrador" })

  const onSubmit = async (data: SocioFormData) => {
    const formattedData: SocioFormData = {
      ...data,
      telefonos: normalizeContacts(data.telefonos),
      correos: normalizeContacts(data.correos),
    }

    try {
      if (isEdit && editId) {
        await sociosService.update(editId, formattedData)
      } else {
        await sociosService.create(formattedData)
      }
      router.push("/dashboard/socios")
    } catch (err) {
      console.error("Error al guardar el socio:", err)
      setError("root", {
        type: "manual",
        message: "No se pudo guardar el socio. Intente nuevamente.",
      })
    }
  }

  const handleVerificarDocumento = async () => {
    const isValid = await trigger("nroDocumento")
    if (!isValid) return

    setLoadingSearch(true)

    try {
      const socio = await sociosService.findByDocumento(nroDocumentoValue)
      if (socio) {
        const formattedTelefonos = (socio.telefonos || []).map((t) =>
          typeof t === "string" ? { value: t } : t
        )
        const formattedCorreos = (socio.correos || []).map((c) =>
          typeof c === "string" ? { value: c } : c
        )

        reset({
          ...socio,
          nroDocumento: socio.nroDocumento || nroDocumentoValue,
          telefonos: formattedTelefonos,
          correos: formattedCorreos,
        })
      } else {
        reset({
          nroDocumento: nroDocumentoValue,
          nombre: "",
          apellido: "",
          fechaNacimiento: "",
          ciudad: "",
          calle: "",
          altura: "",
          fechaAlta: new Date().toISOString().split("T")[0],
          fechaBaja: "",
          obraSocial: "",
          plan: "",
          sepelio: "NO",
          cobrador: "NO",
          telefonos: [],
          correos: [],
        })
      }
      setIsVerificado(true)
    } catch (err) {
      setError("nroDocumento", {
        type: "manual",
        message: "Error al buscar el socio. Intente nuevamente."
      })
      console.error(err)
    } finally {
      setLoadingSearch(false)
    }
  }

  const handleCambiarDocumento = () => {
    setIsVerificado(false)
    reset({
      nroDocumento: "",
      fechaAlta: new Date().toISOString().split("T")[0],
      telefonos: [],
      correos: [],
      plan: "",
      sepelio: "NO",
      cobrador: "NO",
    })
  }

  const populate = React.useCallback(
    (socio: SocioDetalle | null) => {
      if (!socio) return
      reset({
        nroDocumento: socio.nroDocumento,
        nombre: socio.nombre,
        apellido: socio.apellido,
        fechaNacimiento: socio.fechaNacimiento,
        ciudad: socio.ciudad,
        calle: socio.calle,
        altura: socio.altura,
        fechaAlta: socio.fechaAlta,
        fechaBaja: socio.fechaBaja,
        obraSocial: socio.obraSocial,
        plan: socio.plan,
        sepelio: socio.sepelio ?? "NO",
        cobrador: socio.cobrador,
        telefonos: socio.telefonos.map((t) => ({ value: t })),
        correos: socio.correos.map((c) => ({ value: c })),
      })
      setIsVerificado(true)
    },
    [reset]
  )

  React.useEffect(() => {
    if (!isEdit || !editId) return
    let cancelled = false
    sociosService
      .get(editId)
      .then((data) => {
        if (cancelled) return
        populate(data)
      })
      .catch((err) => {
        if (cancelled) return
        console.error("Error al cargar el socio:", err)
      })
    return () => {
      cancelled = true
    }
  }, [isEdit, editId, sociosService, populate])

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface p-4 md:p-8 flex justify-center items-start">
      <Card variant="outlined" className="w-full max-w-6xl p-6 md:p-10 bg-background" style={{ "--input-bg": "var(--color-surface-container-lowest)" } as React.CSSProperties}>
        <h1 className="text-2xl mb-8 font-semibold tracking-tight">
          {isEdit ? "Editar socio" : "Nuevo socio"}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-x-6 gap-y-8">
          <DocumentoField
            register={register}
            errors={errors}
            isVerificado={isVerificado}
            isEdit={isEdit}
            loadingSearch={loadingSearch}
            onBuscar={handleVerificarDocumento}
            onCancelar={() => router.push("/dashboard/socios")}
            onCambiarDocumento={handleCambiarDocumento}
          />

          {isVerificado && (
            <>
              <DatosPersonalesFields
                register={register}
                errors={errors}
                setValue={setValue}
                ciudadValue={ciudadValue}
                editId={editId}
              />

              <div className="col-span-12 my-6">
                <Separator />
              </div>

              <FechasEstadoFields register={register} errors={errors} />

              <ObraSocialFields
                setValue={setValue}
                errors={errors}
                obraSocialValue={selectedObraSocial}
                planValue={planValue}
                sepelioValue={sepelioValue}
                cobradorValue={cobradorValue}
              />

              <ContactosFields control={control} errors={errors} />

              <div className="col-span-12 mt-4">
                <Separator />
              </div>

              <FormFooter
                isEdit={isEdit}
                onIrAlListado={() => router.push("/dashboard/socios")}
                onBuscarOtro={handleCambiarDocumento}
              />
            </>
          )}
        </form>
      </Card>
    </div>
  )
}

export default function NuevoSocioPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-surface-container-lowest p-4 md:p-8" />
      }
    >
      <NuevoSocioForm />
    </React.Suspense>
  )
}
