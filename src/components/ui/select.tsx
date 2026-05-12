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
  const generatedId = React.useId()
  const selectId = id || generatedId

  const valueRef = React.useRef<HTMLSpanElement>(null)
  const [hasValue, setHasValue] = React.useState(false)
  
  React.useEffect(() => {
    if (!valueRef.current) return
    const checkValue = () => {
      const hasPlaceholder = valueRef.current?.querySelector('[data-placeholder]') !== null
      setHasValue(!hasPlaceholder && !!valueRef.current?.textContent?.trim())
    }
    
    checkValue()
    
    const observer = new MutationObserver(() => {
      checkValue()
    })
    observer.observe(valueRef.current, { childList: true, characterData: true, subtree: true, attributes: true })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="group relative w-full isolate">
      <SelectPrimitive.Trigger
        ref={ref}
        id={selectId}
        data-has-value={hasValue}
        className={cn(
          "peer group flex h-14 w-full items-center justify-between rounded-[4px] px-4 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 transition-all duration-200",
          variant === "filled" && [
            "bg-surface-container-highest rounded-t-[4px] rounded-b-none border-b border-on-surface-variant/40",
            "hover:bg-surface-container-high",
            "focus:border-b-2 focus:border-primary data-[state=open]:border-b-2 data-[state=open]:border-primary",
            error && "border-destructive focus:border-destructive data-[state=open]:border-destructive"
          ],
          variant === "outlined" && [
            "bg-transparent border border-outline",
            "hover:border-on-surface",
            "focus:border-2 focus:border-primary data-[state=open]:border-2 data-[state=open]:border-primary",
            error && "border-destructive focus:border-destructive data-[state=open]:border-destructive"
          ],
          className
        )}
        {...props}
      >
        <span ref={valueRef} className={cn("pt-2", label && !hasValue && "opacity-0 group-focus:opacity-100 group-data-[state=open]:opacity-100 transition-opacity")}>{children}</span>
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-300 group-data-[state=open]:rotate-180" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      {label && (
        <label
          htmlFor={selectId}
          className={cn(
            "pointer-events-none absolute left-4 z-10 origin-[0] transform font-medium transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
            variant === "filled"
              ? [
                  "top-4 scale-100 text-base",
                  error ? "text-destructive" : "text-on-surface-variant peer-focus:text-primary peer-data-[state=open]:text-primary",
                  "peer-data-[has-value=true]:-translate-y-3 peer-data-[has-value=true]:scale-75 peer-data-[has-value=true]:text-sm",
                  "peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-sm",
                  "peer-data-[state=open]:-translate-y-3 peer-data-[state=open]:scale-75 peer-data-[state=open]:text-sm",
                ]
              : [
                  "top-4 scale-100 text-base",
                  error ? "text-destructive peer-focus:text-destructive peer-data-[state=open]:text-destructive" : "text-on-surface-variant peer-focus:text-primary peer-data-[state=open]:text-primary",
                  "peer-data-[has-value=true]:-translate-y-7 peer-data-[has-value=true]:scale-75 peer-data-[has-value=true]:bg-[var(--input-bg,var(--background))] peer-data-[has-value=true]:px-1",
                  "peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:bg-[var(--input-bg,var(--background))] peer-focus:px-1",
                  "peer-data-[state=open]:-translate-y-7 peer-data-[state=open]:scale-75 peer-data-[state=open]:bg-[var(--input-bg,var(--background))] peer-data-[state=open]:px-1",
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
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface shadow-m3-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-2 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-2",
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
      "relative flex w-full cursor-default select-none items-center rounded-lg py-3 pl-8 pr-2 text-sm outline-none transition-all hover:bg-black/[0.05] dark:hover:bg-black/[0.2] focus:bg-black/[0.05] dark:focus:bg-black/[0.2] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
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
