import React from "react"
import { Construction } from "lucide-react"

type Props = {
  params: Promise<{ catchAll: string[] }>
}

export default async function CatchAllDashboardPage({ params }: Props) {
  const resolvedParams = await params
  const path = resolvedParams.catchAll
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" / ")

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="size-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
        <Construction className="size-8 text-primary" />
      </div>
      
      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-3 font-sans">
        Módulo en Desarrollo
      </h1>
      
      <p className="text-sm text-on-surface-variant/80 mb-6 leading-relaxed">
        La sección de <span className="font-semibold text-foreground">{path}</span> se encuentra actualmente en proceso de diseño e implementación bajo los estándares de Material Design 3.
      </p>
      
      <div className="text-[11px] font-medium text-primary bg-primary-container px-3 py-1.5 rounded-full select-none">
        Próximamente disponible
      </div>
    </div>
  )
}
