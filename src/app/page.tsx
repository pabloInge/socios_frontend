"use client";

import { Bell, Search, Settings, Home as HomeIcon, Heart, User, Plus, Pencil, Trash, Check, X, Info, AlertTriangle, Menu, ChevronRight, Share2, Mail, MessageSquare, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardMedia, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Chip } from "@/components/ui/chip";
import { Fab } from "@/components/ui/fab";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

function ShowcaseSection({ title, description, children }: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6 sm:space-y-8">
      <div className="space-y-1.5 px-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h2>
        <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">{description}</p>
      </div>
      <div className="rounded-[2rem] bg-surface-container-low [--background:var(--surface-container-low)] p-4 sm:p-8 overflow-hidden border border-outline/10">
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/10">

        <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-4 sm:px-8 bg-background/80 backdrop-blur-xl border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-sm">
              <Search className="w-5 h-5" />
            </Button>
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-foreground/90">
              Sistema de Diseño Material 3
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon-sm">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="h-9 w-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold cursor-pointer">
              P
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-12 space-y-12 sm:space-y-24">

          <section className="py-8 space-y-4 px-1">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Material Design 3</h3>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-[1.1]">
              Catálogo de <br />
              <span className="text-primary/60 italic font-serif">Componentes Estandarizado.</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl">
              Un escaparte vivo de componentes y estilos tipográficos siguiendo las directrices oficiales de Material 3, adaptado para una experiencia premium.
            </p>
          </section>

          <ShowcaseSection
            title="Escala Tipográfica"
            description="La escala de M3 optimiza la legibilidad y jerarquía a través de 5 estilos clave: Display, Headline, Title, Body y Label."
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant text-[0.7rem] uppercase tracking-widest text-muted-foreground">
                    <th className="pb-4 font-bold">Estilo</th>
                    <th className="pb-4 font-bold">Grande (Default)</th>
                    <th className="pb-4 font-bold">Medio</th>
                    <th className="pb-4 font-bold">Pequeño</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  <tr>
                    <td className="py-6 align-top font-mono text-[0.7rem] text-primary/70">Display</td>
                    <td className="py-6 text-5xl font-normal tracking-tight">Display L</td>
                    <td className="py-6 text-4xl font-normal">Display M</td>
                    <td className="py-6 text-3xl font-normal">Display S</td>
                  </tr>
                  <tr>
                    <td className="py-6 align-top font-mono text-[0.7rem] text-primary/70">Headline</td>
                    <td className="py-6 text-2xl font-normal leading-tight">Headline L</td>
                    <td className="py-6 text-xl font-normal">Headline M</td>
                    <td className="py-6 text-lg font-normal">Headline S</td>
                  </tr>
                  <tr>
                    <td className="py-6 align-top font-mono text-[0.7rem] text-primary/70">Title</td>
                    <td className="py-6 text-base font-semibold">Title L</td>
                    <td className="py-6 text-sm font-semibold tracking-wide">Title M</td>
                    <td className="py-6 text-xs font-semibold tracking-wider">Title S</td>
                  </tr>
                  <tr>
                    <td className="py-6 align-top font-mono text-[0.7rem] text-primary/70">Body</td>
                    <td className="py-6 text-base font-normal">Body L</td>
                    <td className="py-6 text-sm font-normal">Body M</td>
                    <td className="py-6 text-xs font-normal">Body S</td>
                  </tr>
                  <tr>
                    <td className="py-6 align-top font-mono text-[0.7rem] text-primary/70">Label</td>
                    <td className="py-6 text-sm font-bold tracking-wide">Label L</td>
                    <td className="py-6 text-xs font-bold tracking-wider">Label M</td>
                    <td className="py-6 text-[0.6rem] font-bold tracking-[0.08em] uppercase">Label S</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            title="Botones"
            description="Acciones con distintos niveles de énfasis. Formato de cápsula total con respuesta táctil refinada."
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-primary/60 px-1">Tipos de Énfasis</p>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="elevated">Elevado</Button>
                  <Button>Primario (Filled)</Button>
                  <Button variant="secondary">Tonal</Button>
                  <Button variant="outline">Delineado</Button>
                  <Button variant="ghost">Texto</Button>
                  <Button variant="destructive">Destructivo</Button>
                  <Button variant="link">Enlace</Button>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-primary/60 px-1">Tamaños</p>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button size="xl">Extra Grande</Button>
                  <Button size="lg">Grande</Button>
                  <Button size="default">Default</Button>
                  <Button size="sm">Pequeño</Button>
                  <Button size="xs">Extra Pequeño</Button>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-primary/60 px-1">Íconos</p>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button size="icon"><Plus /></Button>
                  <Button size="icon-sm" variant="outline"><Search /></Button>
                  <Button size="icon-lg" variant="secondary"><Bell /></Button>
                </div>
              </div>
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            title="Campos de Texto"
            description="Entradas de datos con soporte para etiquetas flotantes y variantes oficiales: Filled y Outlined."
          >
            <div className="space-y-12">
              <div className="space-y-4">
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-primary/60 px-1">Variante Filled (Predeterminada)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl">
                  <Input label="Nombre de Usuario" defaultValue="pablo_dev" variant="filled" />
                  <Input label="Correo Electrónico" type="email" placeholder="ejemplo@correo.com" variant="filled" />
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-primary/60 px-1">Variante Outlined</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl">
                  <Input label="Contraseña" type="password" variant="outlined" />
                  <Input placeholder="Campo sin etiqueta" variant="outlined" />
                </div>
              </div>
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            title="Label"
            description="Etiquetas semánticas para formularios, asociadas a controles mediante htmlFor."
          >
            <div className="flex flex-wrap gap-6 items-center">
              <Label htmlFor="demo-input-1">Etiqueta de formulario</Label>
              <Label htmlFor="demo-input-2" className="text-primary">Etiqueta primaria</Label>
              <Label htmlFor="demo-input-3" className="opacity-50 cursor-not-allowed">Etiqueta deshabilitada</Label>
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            title="Tarjetas"
            description="Contenedores sólidos para agrupar información con radios XL y elevación tonal sin sombras."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Tarjeta Elevada</CardTitle>
                  <CardDescription>Máximo Énfasis Tonal</CardDescription>
                </CardHeader>
                <CardContent>
                  Se distingue del fondo mediante un tono de contenedor secundario suave.
                </CardContent>
                <CardFooter>
                  <Button size="sm">Acción</Button>
                </CardFooter>
              </Card>

              <Card variant="filled">
                <CardHeader>
                  <CardTitle>Tarjeta Rellena</CardTitle>
                  <CardDescription>Estándar de Superficie M3</CardDescription>
                </CardHeader>
                <CardContent>
                  La variante más equilibrada para la mayoría de los bloques de contenido.
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" size="sm">Acción</Button>
                </CardFooter>
              </Card>

              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>Tarjeta Delineada</CardTitle>
                  <CardDescription>Bajo Énfasis Tonal</CardDescription>
                </CardHeader>
                <CardContent>
                  Ideal para agrupar información secundaria de forma discreta y limpia.
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm">Acción</Button>
                </CardFooter>
              </Card>

              <Card variant="filled">
                <CardMedia className="flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary-container" />
                  <Heart className="relative size-8 text-primary/60" />
                </CardMedia>
                <CardHeader>
                  <CardTitle>Contenido Visual</CardTitle>
                  <CardDescription>Diseño Vertical</CardDescription>
                </CardHeader>
                <CardContent>
                  Soporte para contenido visual con radios adaptados automáticamente.
                </CardContent>
              </Card>

              <Card variant="outlined" orientation="horizontal" className="col-span-1 md:col-span-2">
                <CardMedia className="flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-secondary-container/60 to-primary/20" />
                  <Share2 className="relative size-6 text-primary/70" />
                </CardMedia>
                <CardContent className="flex flex-col justify-center gap-1">
                  <CardTitle>Diseño Horizontal</CardTitle>
                  <CardDescription>Variante Flexible</CardDescription>
                  <p className="text-sm text-on-surface-variant/70 mt-1">Ideal para listas de elementos o secciones de tablero de control.</p>
                  <Button variant="link" size="sm" className="self-start -ml-2 mt-1">Ver Detalles</Button>
                </CardContent>
              </Card>
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            title="Tabla de Datos"
            description="Visualización de información estructurada con estilos M3 Flat, soporte para acciones inline y estados visuales."
          >
            <div className="bg-surface-container-lowest rounded-[28px] border border-outline-variant overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre completo</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Juan Pérez</TableCell>
                    <TableCell className="text-on-surface-variant">Administrador</TableCell>
                    <TableCell>
                      <Chip variant="assist" className="pointer-events-none">Activo</Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon-sm" title="Visualizar"><Eye /></Button>
                        <Button variant="ghost" size="icon-sm" title="Editar"><Edit /></Button>
                        <Button variant="ghost" size="icon-sm" title="Eliminar" className="text-destructive"><Trash2 /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Ana García</TableCell>
                    <TableCell className="text-on-surface-variant">Socio Vitalicio</TableCell>
                    <TableCell>
                      <Chip variant="assist" className="pointer-events-none">Al día</Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon-sm" title="Visualizar"><Eye /></Button>
                        <Button variant="ghost" size="icon-sm" title="Editar"><Edit /></Button>
                        <Button variant="ghost" size="icon-sm" title="Eliminar" className="text-destructive"><Trash2 /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            title="Botones de Acción Flotante (FAB)"
            description="Acción principal de la pantalla. Disponible en cuatro tamaños y variantes de color."
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-primary/60 px-1">Tamaños</p>
                <div className="flex flex-wrap items-end gap-6">
                  <div className="flex flex-col items-center gap-3">
                    <Fab size="large" icon={<Search />} />
                    <span className="text-[0.65rem] font-medium text-muted-foreground">Grande</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <Fab icon={<Bell />} />
                    <span className="text-[0.65rem] font-medium text-muted-foreground">Estándar</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <Fab size="small" icon={<Plus />} />
                    <span className="text-[0.65rem] font-medium text-muted-foreground">Pequeño</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <Fab size="extended" label="Redactar" icon={<Pencil />} />
                    <span className="text-[0.65rem] font-medium text-muted-foreground">Extendido</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-primary/60 px-1">Variantes de Color</p>
                <div className="flex flex-wrap items-center gap-6">
                  <Fab variant="primary" icon={<Plus />} />
                  <Fab variant="secondary" icon={<Plus />} />
                  <Fab variant="tertiary" icon={<Plus />} />
                  <Fab variant="surface" icon={<Plus />} />
                </div>
              </div>
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            title="Chips"
            description="Elementos compactos para filtrado, selección de entradas y acciones contextuales."
          >
            <div className="flex flex-wrap gap-3">
              <Chip variant="assist" icon={<Settings />}>Assist</Chip>
              <Chip variant="filter" selected>Filter</Chip>
              <Chip variant="input" onRemove={() => {}}>Input</Chip>
              <Chip variant="suggestion">Suggestion</Chip>
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            title="Separador"
            description="Divisor visual para separar secciones de contenido, horizontal o vertical."
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-primary/60 px-1">Horizontal</p>
                <Separator />
              </div>
              <div className="space-y-4">
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-primary/60 px-1">Vertical</p>
                <div className="flex items-center gap-4 h-8">
                  <span className="text-sm text-muted-foreground">Izquierda</span>
                  <Separator orientation="vertical" />
                  <span className="text-sm text-muted-foreground">Derecha</span>
                </div>
              </div>
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            title="Skeleton"
            description="Marcador de posición animado para estados de carga, evitando saltos de diseño."
          >
            <div className="space-y-6 max-w-sm">
              <div className="flex items-center gap-4">
                <Skeleton className="size-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-32 w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            title="Tooltip"
            description="Información contextual emergente al pasar el cursor sobre un elemento interactivo."
          >
            <div className="flex flex-wrap gap-6 items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Información</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tooltip de información básica</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Info />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Tooltip lateral derecho</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Ajustes del sistema</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            title="Select"
            description="Componente de selección desplegable con soporte para etiquetas flotantes y variantes M3."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl">
              <Select>
                <SelectTrigger label="Plan de Socio" variant="filled">
                  <SelectValue placeholder="Seleccione un plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Planes disponibles</SelectLabel>
                    <SelectItem value="a">Plan A - Estándar</SelectItem>
                    <SelectItem value="b">Plan B - Premium</SelectItem>
                    <SelectItem value="c">Plan C - Familiar</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger label="Estado de Cuenta" variant="outlined">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            title="Diálogos (Modales)"
            description="Ventanas emergentes centradas para tareas críticas o información adicional."
          >
            <div className="flex flex-wrap gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Abrir Diálogo Simple</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>¿Confirmar acción?</DialogTitle>
                    <DialogDescription>
                      Esta acción no se puede deshacer. Esto eliminará permanentemente los datos seleccionados.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <Button variant="ghost">Cancelar</Button>
                    </DialogClose>
                    <Button variant="default">Confirmar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary">Buscar Obra Social</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Buscar Obra Social</DialogTitle>
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
                           <TableRow>
                             <TableCell>001</TableCell>
                             <TableCell>PAMI</TableCell>
                             <TableCell className="text-right"><Button size="sm">Elegir</Button></TableCell>
                           </TableRow>
                           <TableRow>
                             <TableCell>002</TableCell>
                             <TableCell>OSDE</TableCell>
                             <TableCell className="text-right"><Button size="sm">Elegir</Button></TableCell>
                           </TableRow>
                         </TableBody>
                       </Table>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cerrar</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            title="Iconografía"
            description="Iconos de sistema optimizados para legibilidad y consistencia visual."
          >
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6 sm:gap-8">
              {[
                { Icon: HomeIcon, label: "Inicio" },
                { Icon: Search, label: "Buscar" },
                { Icon: Settings, label: "Ajustes" },
                { Icon: Bell, label: "Notificaciones" },
                { Icon: Heart, label: "Favoritos" },
                { Icon: User, label: "Cuenta" },
                { Icon: Plus, label: "Añadir" },
                { Icon: Pencil, label: "Editar" },
                { Icon: Trash, label: "Eliminar" },
                { Icon: Check, label: "Hecho" },
                { Icon: X, label: "Cerrar" },
                { Icon: Info, label: "Info" },
                { Icon: AlertTriangle, label: "Alerta" },
                { Icon: Menu, label: "Menú" },
                { Icon: ChevronRight, label: "Siguiente" },
                { Icon: Share2, label: "Compartir" },
                { Icon: Mail, label: "Correo" },
                { Icon: MessageSquare, label: "Chat" },
                { Icon: Eye, label: "Visualizar" },
                { Icon: Edit, label: "Modificar" },
                { Icon: Trash2, label: "Papelera" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-3 group cursor-pointer transition-transform active:scale-[0.98]">
                  <div className="size-12 rounded-2xl bg-surface-container-highest flex items-center justify-center transition-colors group-hover:bg-primary/10">
                    <Icon className="size-6 text-on-surface-variant group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-[0.6rem] font-medium text-muted-foreground group-hover:text-foreground text-center line-clamp-1">{label}</span>
                </div>
              ))}
            </div>
          </ShowcaseSection>

        </main>

        <footer className="p-12 text-center border-t border-outline-variant bg-surface-container-lowest">
          <p className="text-muted-foreground text-sm font-medium">
            SocioFrontend &copy; 2026 <br />
            <span className="text-xs opacity-50 font-normal">Next.js + Tailwind v4 + Material Design 3</span>
          </p>
        </footer>

      </div>
    </TooltipProvider>
  );
}
