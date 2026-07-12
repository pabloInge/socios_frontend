"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Chip } from "@/components/ui/chip"
import type { SocioDetalle } from "@/app/dashboard/socios/actions"

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
  )
}

function FieldRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold tracking-widest text-on-surface-variant/60 mb-1.5">{label}</p>
      <p className="text-base font-medium text-foreground break-words">{value || "\u2014"}</p>
    </div>
  )
}

export function SocioDetalleCard({ socio }: { socio: SocioDetalle }) {
  return (
    <div className="space-y-8">
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1.5">
              <CardTitle className="text-3xl">
                {socio.apellido}, {socio.nombre}
              </CardTitle>
              <p className="text-base text-on-surface-variant">
                {socio.tipoDocumento} {socio.nroDocumento}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          <div className="flex flex-wrap gap-3">
            <Chip variant="assist" className="pointer-events-none">{socio.obraSocial || "Sin obra social"}</Chip>
            <Chip variant="assist" className="pointer-events-none">Plan {socio.plan}</Chip>
            <Chip variant="assist" className="pointer-events-none">{socio.sepelio === "SI" ? "Sepelio incluido" : "Sin sepelio"}</Chip>
            <Chip variant="assist" className="pointer-events-none">{socio.cobrador === "SI" ? "Cobrador asignado" : "Sin cobrador"}</Chip>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-3">
            <FieldRow label="Fecha de Alta" value={socio.fechaAlta} />
            {socio.fechaBaja && (
              <FieldRow label="Fecha de Baja" value={socio.fechaBaja} />
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SectionCard title="Información Personal">
          <FieldRow label="Nombre" value={`${socio.nombre} ${socio.apellido}`} />
          <FieldRow label="Fecha de Nacimiento" value={socio.fechaNacimiento} />
          <FieldRow label="Tipo Documento" value={socio.tipoDocumento} />
          <FieldRow label="N° Documento" value={socio.nroDocumento} />
        </SectionCard>

        <SectionCard title="Dirección">
          <FieldRow label="Ciudad" value={socio.ciudad} />
          <FieldRow label="Calle" value={socio.calle} />
          <FieldRow label="Altura" value={socio.altura} />
        </SectionCard>

        <SectionCard title="Contacto">
          {socio.telefonos.length > 0 ? (
            <div className="space-y-1.5">
              <p className="text-xs font-bold tracking-widest text-on-surface-variant/60">Teléfonos</p>
              {socio.telefonos.map((tel, i) => (
                <p key={i} className="text-base font-medium text-foreground">{tel}</p>
              ))}
            </div>
          ) : (
            <FieldRow label="Teléfonos" value={null} />
          )}
          {socio.correos.length > 0 ? (
            <div className="space-y-1.5">
              <p className="text-xs font-bold tracking-widest text-on-surface-variant/60">Correos Electrónicos</p>
              {socio.correos.map((correo, i) => (
                <p key={i} className="text-base font-medium text-foreground">{correo}</p>
              ))}
            </div>
          ) : (
            <FieldRow label="Correos Electrónicos" value={null} />
          )}
        </SectionCard>

        <SectionCard title="Plan y Cobertura">
          <FieldRow label="Obra Social" value={socio.obraSocial} />
          <FieldRow label="Plan" value={socio.plan} />
          <FieldRow label="Sepelio" value={socio.sepelio === "SI" ? "Incluido" : "No incluido"} />
          <FieldRow label="Cobrador" value={socio.cobrador === "SI" ? "Asignado" : "No asignado"} />
        </SectionCard>
      </div>
    </div>
  )
}
