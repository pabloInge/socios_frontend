import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center bg-clip-padding text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] outline-none select-none active:scale-[0.95] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        elevated:
          "bg-surface-container-low text-primary shadow-m3-1 hover:shadow-m3-2 hover:bg-surface-container-low/90",
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-m3-1",
        secondary:
          "bg-secondary-container text-on-secondary-container hover:bg-on-secondary-container/10",
        outline:
          "border-[0.5px] border-outline-variant bg-transparent hover:bg-on-surface/5 hover:text-foreground",
        ghost:
          "hover:bg-on-surface/5 hover:text-foreground",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 active:bg-destructive/30",
        link:
          "text-primary underline-offset-4 hover:underline font-medium",
      },
      size: {
        default:  "h-10 gap-2 px-6 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs:       "h-7 gap-1 px-3 text-xs",
        sm:       "h-8 gap-1.5 px-4 text-[0.8rem]",
        lg:       "h-12 gap-2 px-8 text-base",
        xl:       "h-14 gap-3 px-10 text-base",
        icon:     "size-10",
        "icon-xs": "size-7",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
      shape: {
        default: "rounded-full",
        square:  "rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  shape = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      className={cn(buttonVariants({ variant, size, shape, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
