"use client"

import * as React from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterToggleContextValue {
  isOpen: boolean
  toggle: (next: boolean) => void
}

const FilterToggleContext = React.createContext<FilterToggleContextValue | null>(null)

function useFilterToggle() {
  const ctx = React.useContext(FilterToggleContext)
  if (!ctx) {
    throw new Error("FilterToggle subcomponentes deben usarse dentro de <FilterToggle>")
  }
  return ctx
}

export interface FilterToggleProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function FilterToggle({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
}: FilterToggleProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isControlled = openProp !== undefined
  const isOpen = isControlled ? openProp : internalOpen

  const toggle = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange]
  )

  const value = React.useMemo(() => ({ isOpen, toggle }), [isOpen, toggle])

  return (
    <FilterToggleContext.Provider value={value}>
      <div className={cn("w-full", className)}>{children}</div>
    </FilterToggleContext.Provider>
  )
}

export interface FilterToggleTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  activeCount?: number
  label?: string
  onClear?: () => void
}

function FilterToggleTrigger({
  activeCount = 0,
  label = "Filtros",
  onClear,
  className,
  ...props
}: FilterToggleTriggerProps) {
  const { isOpen, toggle } = useFilterToggle()
  const hasActive = activeCount > 0

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="filter-toggle-panel"
        onClick={() => toggle(!isOpen)}
        className={cn(
          "group inline-flex h-14 items-center gap-2 rounded-full border px-4 text-sm font-medium tracking-wide transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          hasActive
            ? "border-secondary-container bg-secondary-container text-on-secondary-container hover:bg-secondary-container/90"
            : "border-outline bg-transparent text-foreground hover:bg-foreground/[0.08]",
          className
        )}
        {...props}
      >
        <SlidersHorizontal
          className={cn(
            "size-[18px] shrink-0 transition-transform duration-300",
            isOpen && "rotate-90"
          )}
          aria-hidden
        />
        <span>{label}</span>
        {hasActive && (
          <span
            className={cn(
              "ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
              hasActive
                ? "bg-primary text-primary-foreground"
                : "bg-surface-container-highest text-on-surface-variant"
            )}
          >
            {activeCount}
          </span>
        )}
      </button>

      {hasActive && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-on-surface-variant transition-colors hover:bg-foreground/[0.08] hover:text-foreground"
        >
          <X className="size-4" aria-hidden />
          Limpiar
        </button>
      )}
    </div>
  )
}

export interface FilterToggleContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

function FilterToggleContent({
  children,
  className,
  ...props
}: FilterToggleContentProps) {
  const { isOpen } = useFilterToggle()

  return (
    <div
      id="filter-toggle-panel"
      className={cn(
        "grid transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
      {...props}
    >
      <div className="overflow-hidden">
        <div className={cn("pt-4", className)}>{children}</div>
      </div>
    </div>
  )
}

export { FilterToggle, FilterToggleTrigger, FilterToggleContent }
