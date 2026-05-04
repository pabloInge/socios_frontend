import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const fabVariants = cva(
  "inline-flex items-center justify-center shadow-m3-3 hover:shadow-m3-4 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] active:scale-90 active:shadow-m3-3 disabled:pointer-events-none disabled:opacity-50 group [&_svg]:transition-transform [&_svg]:duration-500 hover:[&_svg]:rotate-90",
  {
    variants: {
      variant: {
        primary:   "bg-primary-container text-on-primary-container",
        secondary: "bg-secondary-container text-on-secondary-container",
        surface:   "bg-surface-container-high text-primary",
        tertiary:  "bg-tertiary-container text-on-tertiary-container",
      },
      size: {
        small:    "size-10 rounded-[12px] [&_svg]:size-5",
        default:  "size-14 rounded-[16px] [&_svg]:size-6",
        large:    "size-24 rounded-[28px] [&_svg]:size-8",
        extended: "h-14 px-4 rounded-full gap-3 text-sm font-medium tracking-wide",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface FabProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof fabVariants> {
  label?: string
  icon?: React.ReactNode
}

const Fab = React.forwardRef<HTMLButtonElement, FabProps>(
  ({ className, variant, size, label, icon, "aria-label": ariaLabel, ...props }, ref) => {
    const resolvedAriaLabel = ariaLabel ?? (size !== "extended" ? label : undefined)

    return (
      <button
        ref={ref}
        aria-label={resolvedAriaLabel}
        className={cn(fabVariants({ variant, size, className }))}
        {...props}
      >
        {icon}
        {size === "extended" && label && <span>{label}</span>}
      </button>
    )
  }
)
Fab.displayName = "Fab"

export { Fab, fabVariants }
