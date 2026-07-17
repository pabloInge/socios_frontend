"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SocioDetalleCard } from "@/components/ui/socio-detalle"
import { useSociosService, type SocioDetalle } from "@/lib/socios/service-context"

export default function SocioDetallePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const sociosService = useSociosService()

  const [socio, setSocio] = React.useState<SocioDetalle | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    sociosService
      .get(id)
      .then((data) => {
        if (cancelled) return
        setSocio(data)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id, sociosService])

  return (
    <div className="relative h-full p-4 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon-lg" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">Detalle del Socio</h1>
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
        <SocioDetalleCard socio={socio} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8">
          <p className="text-lg font-medium text-on-surface-variant">Socio no encontrado</p>
          <p className="text-sm text-on-surface-variant/60 mt-1">El socio solicitado no existe o ha sido eliminado.</p>
          <Button variant="outline" className="mt-6" onClick={() => router.back()}>
            Volver al listado
          </Button>
        </div>
      )}
    </div>
  )
}
