import * as React from "react"
import { cn } from "@/lib/utils"

function Card({
  className,
  children,
  size = "default",
  variant = "filled",
  orientation = "vertical",
  interactive = true,
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "sm"
  variant?: "elevated" | "filled" | "outlined"
  orientation?: "vertical" | "horizontal"
  interactive?: boolean
}) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant}
      data-orientation={orientation}
      className={cn(
        "group/card relative flex overflow-hidden text-sm outline-none isolate",
        orientation === "vertical" ? "flex-col" : "flex-row",
        "transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
        interactive && "cursor-pointer active:scale-[0.995] focus-visible:ring-2 focus-visible:ring-primary",

        size === "default" && "rounded-card",
        size === "sm" && "rounded-md",

        variant === "elevated" && [
          "bg-surface-container-low [--background:var(--surface-container-low)] shadow-m3-1",
          interactive && "hover:shadow-m3-2 hover:-translate-y-0.5",
        ],
        variant === "filled" && [
          "bg-surface-container-highest [--background:var(--surface-container-highest)] shadow-none",
          interactive && "hover:shadow-m3-1 hover:-translate-y-0.5",
        ],
        variant === "outlined" && [
          "bg-background [--background:var(--background)] border border-outline shadow-none",
        ],

        "has-data-[slot=card-footer]:pb-0",

        size === "default" && [
          orientation === "vertical"
            ? "*:[&:first-child]:rounded-t-card *:[&:last-child]:rounded-b-card"
            : "*:[&:first-child]:rounded-l-card *:[&:last-child]:rounded-r-card"
        ],
        size === "sm" && [
          orientation === "vertical"
            ? "*:[&:first-child]:rounded-t-md *:[&:last-child]:rounded-b-md"
            : "*:[&:first-child]:rounded-l-md *:[&:last-child]:rounded-r-md",
          "p-0"
        ],

        className
      )}
      {...props}
    >
      {interactive && (
        <div className={cn(
          "absolute inset-0 z-[1] pointer-events-none transition-colors duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          "group-hover/card:bg-on-surface-variant/[0.08]",
          "group-focus-visible/card:bg-on-surface-variant/[0.12]",
          "group-has-[[data-state=open]]/card:bg-on-surface-variant/[0.12]",
          "group-active/card:bg-on-surface-variant/[0.12]"
        )} />
      )}
      {children}
    </div>
  )
}

function CardMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-media"
      className={cn(
        "relative overflow-hidden bg-surface-container-high shrink-0",
        "group-data-[orientation=vertical]/card:w-full group-data-[orientation=vertical]/card:aspect-video",
        "group-data-[orientation=horizontal]/card:h-full group-data-[orientation=horizontal]/card:w-28",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-card px-4 pt-4 first:pt-4 group-data-[size=sm]/card:px-3 group-data-[size=sm]/card:pt-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-3 group-data-[size=sm]/card:[.border-b]:pb-2",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-lg leading-snug font-semibold group-data-[size=sm]/card:text-base",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-on-surface-variant/80", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("flex-1 px-4 pb-4 group-data-[size=sm]/card:px-3 group-data-[size=sm]/card:pb-3", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center justify-end p-4 pt-0 group-data-[size=sm]/card:p-3 group-data-[size=sm]/card:pt-0",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardMedia,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
