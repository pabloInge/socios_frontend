"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    label?: string
    variant?: "filled" | "outlined"
    error?: boolean
  }
>(({ className, children, label, id, variant = "filled", error, ...props }, ref) => {
  const [hasValue, setHasValue] = React.useState(false)
  const generatedId = React.useId()
  const selectId = id || generatedId

  const valueRef = React.useRef<HTMLSpanElement>(null)
  
  React.useEffect(() => {
    if (!valueRef.current) return
    const observer = new MutationObserver(() => {
        const text = valueRef.current?.textContent || ""
        setHasValue(text.length > 0)
    })
    observer.observe(valueRef.current, { childList: true, characterData: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="group relative w-full">
      <SelectPrimitive.Trigger
        ref={ref}
        id={selectId}
        className={cn(
          "peer flex h-14 w-full items-center justify-between rounded-[4px] px-4 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 transition-all duration-200",
          variant === "filled" && [
            "bg-surface-container-highest rounded-t-[4px] rounded-b-none border-b border-on-surface-variant/40",
            "hover:bg-surface-container-high",
            "focus:border-b-2 focus:border-primary",
            error && "border-destructive focus:border-destructive"
          ],
          variant === "outlined" && [
            "bg-transparent border border-outline",
            "hover:border-on-surface",
            "focus:border-2 focus:border-primary",
            error && "border-destructive focus:border-destructive"
          ],
          className
        )}
        {...props}
      >
        <span ref={valueRef} className="pt-2">{children}</span>
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      {label && (
        <label
          htmlFor={selectId}
          className={cn(
            "pointer-events-none absolute left-4 z-10 origin-[0] transform font-medium transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
            variant === "filled"
              ? [
                  "top-4 -translate-y-3 scale-75 text-sm",
                  error ? "text-destructive" : "text-on-surface-variant peer-focus:text-primary",
                  !hasValue && "peer-[:not([data-state=open])]:translate-y-0 peer-[:not([data-state=open])]:scale-100",
                  "peer-[[data-state=open]]:-translate-y-3 peer-[[data-state=open]]:scale-75",
                ]
              : [
                  "top-4 scale-100 text-base",
                  error ? "text-destructive" : "text-on-surface-variant peer-focus:text-primary",
                  "peer-[[data-state=open]]:-translate-y-7 peer-[[data-state=open]]:scale-75 peer-[[data-state=open]]:bg-[var(--input-bg,var(--background))] peer-[[data-state=open]]:px-1",
                  hasValue && "-translate-y-7 scale-75 bg-[var(--input-bg,var(--background))] px-1",
                ]
          )}
        >
          {label}
        </label>
      )}
    </div>
  )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-[4px] border border-outline-variant bg-surface-container-lowest text-on-surface shadow-m3-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-xs font-medium text-on-surface-variant", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-3 pl-8 pr-2 text-sm outline-none hover:bg-on-surface/[0.08] focus:bg-on-surface/[0.08] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-primary" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-outline-variant", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
