import * as React from "react"
import { Check, X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const chipVariants = cva(
  "inline-flex items-center rounded-[8px] h-8 text-sm font-medium tracking-[0.1px] border transition-all duration-200 active:scale-[0.98] cursor-pointer select-none",
  {
    variants: {
      variant: {
        assist:     "gap-2 px-3 bg-transparent border-outline text-foreground hover:bg-foreground/[0.08]",
        filter:     "gap-2 px-3 bg-transparent border-outline text-foreground hover:bg-foreground/[0.08]",
        input:      "gap-2 pl-3 pr-2 bg-transparent border-outline text-on-surface-variant hover:bg-foreground/[0.08]",
        suggestion: "gap-2 px-3 bg-transparent border-outline text-foreground hover:bg-foreground/[0.08]",
      },
    },
    defaultVariants: {
      variant: "assist",
    },
  }
)

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof chipVariants> {
  selected?: boolean
  icon?: React.ReactNode
  onRemove?: () => void
  children: React.ReactNode
}

function Chip({ className, variant, selected, icon, onRemove, children, ...props }: ChipProps) {
  const isFilterSelected = selected && variant === "filter"
  const hasLeadingIcon = isFilterSelected || !!icon

  return (
    <button
      type="button"
      className={cn(
        chipVariants({ variant }),
        hasLeadingIcon && "pl-2",
        isFilterSelected && "bg-secondary-container text-on-secondary-container border-secondary-container hover:bg-secondary-container/90",
        selected && !isFilterSelected && "bg-primary-container text-on-primary-container border-primary-container",
        className
      )}
      {...props}
    >
      {isFilterSelected ? (
        <Check className="size-[18px] shrink-0" aria-hidden />
      ) : icon ? (
        <span className="size-[18px] shrink-0 flex items-center justify-center [&_svg]:size-[18px]" aria-hidden>
          {icon}
        </span>
      ) : null}

      <span>{children}</span>

      {variant === "input" && onRemove && (
        <span
          role="button"
          aria-label="Eliminar"
          tabIndex={0}
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); onRemove(); } }}
          className="ml-0.5 size-[18px] shrink-0 flex items-center justify-center rounded-full hover:bg-foreground/[0.12] transition-colors"
        >
          <X className="size-3" aria-hidden />
        </span>
      )}
    </button>
  )
}

export { Chip, chipVariants }
