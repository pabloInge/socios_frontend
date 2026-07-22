"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export type ConfirmDialogVariant = "destructive" | "primary" | "warning" | "info"

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  description?: React.ReactNode
  confirmText?: string
  cancelText?: string
  variant?: ConfirmDialogVariant
  loading?: boolean
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
}

const variantStyles: Record<
  ConfirmDialogVariant,
  {
    confirmButtonVariant: "destructive" | "default" | "secondary"
  }
> = {
  destructive: {
    confirmButtonVariant: "destructive",
  },
  warning: {
    confirmButtonVariant: "default",
  },
  info: {
    confirmButtonVariant: "default",
  },
  primary: {
    confirmButtonVariant: "default",
  },
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "primary",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const style = variantStyles[variant] || variantStyles.primary

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true)
      await onConfirm()
      onOpenChange(false)
    } catch (error) {
      console.error("Error en confirmación:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    onOpenChange(false)
  }

  const isLoading = loading || isSubmitting

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-6 gap-6">
        <DialogHeader className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
          <div className="space-y-1">
            <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-sm text-on-surface-variant leading-relaxed">
                {description}
              </DialogDescription>
            )}
          </div>
        </DialogHeader>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={style.confirmButtonVariant}
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
