"use client"

import * as React from "react"
import { DropdownMenu } from "radix-ui"
import { Columns3, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ColumnToggleItem {
  key: string
  label: string
  visible: boolean
}

export interface ColumnToggleProps {
  items: ColumnToggleItem[]
  onToggle: (key: string) => void
  label?: string
  compact?: boolean
  className?: string
}

function ColumnToggle({
  items,
  onToggle,
  label = "Columnas",
  compact = false,
  className,
}: ColumnToggleProps) {
  const visibleCount = items.filter((i) => i.visible).length

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Mostrar u ocultar columnas"
          aria-haspopup="menu"
          className={cn(
            "inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            compact
              ? "size-9 rounded-full text-on-surface-variant hover:bg-foreground/[0.08] hover:text-foreground"
              : "h-14 gap-2 rounded-full border px-4 text-sm font-medium tracking-wide border-outline bg-transparent text-foreground hover:bg-foreground/[0.08] data-[state=open]:border-on-surface",
            className
          )}
        >
          <Columns3 className="size-[18px] shrink-0" aria-hidden />
          {!compact && <span>{label}</span>}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-50 min-w-[14rem] rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface p-1 shadow-m3-2",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          <DropdownMenu.Label className="px-3 py-2 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
            Mostrar columnas
          </DropdownMenu.Label>
          <DropdownMenu.Separator className="-mx-1 my-1 h-px bg-outline-variant" />
          {items.map((item) => {
            const isLastVisible = item.visible && visibleCount <= 1
            return (
              <DropdownMenu.CheckboxItem
                key={item.key}
                checked={item.visible}
                disabled={isLastVisible}
                onCheckedChange={() => onToggle(item.key)}
                className={cn(
                  "group relative flex w-full cursor-default select-none items-center gap-2 rounded-lg py-2.5 pl-3 pr-3 text-sm outline-none transition-colors",
                  "focus:bg-on-surface/5 data-[disabled]:opacity-40 data-[disabled]:pointer-events-none"
                )}
              >
                <span className="flex size-5 items-center justify-center rounded border border-outline">
                  <DropdownMenu.ItemIndicator>
                    <Check className="size-4 text-primary" aria-hidden />
                  </DropdownMenu.ItemIndicator>
                </span>
                <span className="flex-1">{item.label}</span>
              </DropdownMenu.CheckboxItem>
            )
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export { ColumnToggle }
