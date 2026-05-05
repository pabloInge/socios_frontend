import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CircleX, TriangleAlert, Eye, EyeOff } from "lucide-react"

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & {
    label?: string
    variant?: "filled" | "outlined"
    error?: boolean
    errorText?: string
  }
>(({ className, type, label, id, variant = "filled", error, errorText, onChange, onInvalid, onFocus, onBlur, ...props }, ref) => {
  const generatedId = React.useId()
  const inputId = id || generatedId

  const innerRef = React.useRef<HTMLInputElement>(null)

  React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement)

  const [hasValue, setHasValue] = React.useState(
    Boolean(props.value || props.defaultValue)
  )
  const [nativeWarning, setNativeWarning] = React.useState<string>("")
  const [isFocused, setIsFocused] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [internalErrorCleared, setInternalErrorCleared] = React.useState(false)

  const isPassword = type === "password"
  const currentType = isPassword ? (showPassword ? "text" : "password") : type

  React.useEffect(() => {
    setInternalErrorCleared(false)
  }, [error, errorText])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0)
    if (nativeWarning) {
      if (e.target.validity.valid) {
        setNativeWarning("")
      } else {
        setNativeWarning(e.target.validationMessage)
      }
    }
    if (error || errorText) {
      setInternalErrorCleared(true)
    }
    if (onChange) {
      onChange(e)
    }
  }

  React.useEffect(() => {
    if (props.value !== undefined) {
      setHasValue(String(props.value).length > 0)
    }
  }, [props.value])

  React.useEffect(() => {
    const form = innerRef.current?.closest("form")
    if (form) {
      const handleFormSubmit = () => {
        setInternalErrorCleared(false)
      }
      form.addEventListener("submit", handleFormSubmit)
      return () => form.removeEventListener("submit", handleFormSubmit)
    }
  }, [])

  const handleClear = () => {
    if (innerRef.current) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set
      nativeInputValueSetter?.call(innerRef.current, "")
      const event = new Event("input", { bubbles: true })
      innerRef.current.dispatchEvent(event)
      if (nativeWarning && innerRef.current.validity.valid) {
        setNativeWarning("")
      }
      if (error || errorText) {
        setInternalErrorCleared(true)
      }
    }
  }

  const isError = (error || !!errorText) && !internalErrorCleared
  const displayErrorText = internalErrorCleared ? undefined : errorText
  const isWarning = !!nativeWarning

  return (
    <div className={cn("group relative w-full", className)}>
      <div
        className={cn(
          "relative isolate h-14 w-full transition-all duration-200",
          variant === "filled" && [
            "rounded-t-[4px] bg-surface-container-highest",
            "hover:bg-surface-container-high",
            "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px]",
            isError ? "after:bg-destructive focus-within:after:bg-destructive"
            : isWarning ? "after:bg-yellow-500 focus-within:after:bg-yellow-500"
            : "after:bg-on-surface-variant/40 focus-within:after:bg-primary",
            "focus-within:after:h-[2px] focus-within:after:transition-all",
          ],
          variant === "outlined" && [
            "rounded-[4px] border bg-transparent",
            isError ? "border-destructive focus-within:border-destructive hover:border-destructive"
            : isWarning ? "border-yellow-500 focus-within:border-yellow-500 hover:border-yellow-500"
            : "border-outline hover:border-on-surface-variant focus-within:border-primary",
            "focus-within:border-2",
          ]
        )}
      >
        <input
          id={inputId}
          type={currentType}
          ref={innerRef}
          data-slot="input"
          onChange={handleChange}
          onFocus={(e) => {
            setIsFocused(true)
            if (onFocus) onFocus(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            if (onBlur) onBlur(e)
          }}
          onInvalid={(e) => {
            e.preventDefault()
            setNativeWarning(e.currentTarget.validationMessage)
            if (onInvalid) {
              onInvalid(e)
            }
          }}
          placeholder={props.placeholder || (label ? " " : undefined)}
          className={cn(
            "peer block h-full w-full appearance-none bg-transparent px-4 text-base text-foreground transition-all outline-none disabled:pointer-events-none disabled:opacity-50",
            "placeholder:text-on-surface-variant/60 pr-20",
            "[&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-credentials-auto-fill-button]:hidden",
            label && "placeholder:opacity-0 focus:placeholder:opacity-100",
            label ? (variant === "filled" ? "pb-2 pt-6" : "py-2") : "py-2"
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "pointer-events-none absolute left-4 z-10 origin-[0] transform font-medium transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
              variant === "filled"
                ? [
                    "top-4 -translate-y-3 scale-75 text-sm",
                    isError ? "text-destructive"
                    : isWarning ? "text-yellow-600 dark:text-yellow-500"
                    : "text-on-surface-variant peer-focus:text-primary",
                    "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100",
                    "peer-focus:-translate-y-3 peer-focus:scale-75",
                  ]
                : [
                    "top-4 scale-100 text-base",
                    isError ? "text-destructive peer-focus:text-destructive"
                    : isWarning ? "text-yellow-600 dark:text-yellow-500 peer-focus:text-yellow-500"
                    : "text-on-surface-variant peer-focus:text-primary",
                    "peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:py-px peer-focus:px-1 peer-focus:bg-[var(--input-bg,var(--background))]",
                    "peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:py-px peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:bg-[var(--input-bg,var(--background))]",
                  ],
              "peer-disabled:opacity-50"
            )}
          >
            {label}
          </label>
        )}

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isPassword && isFocused && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowPassword(!showPassword)}
              className="text-on-surface-variant hover:text-foreground transition-colors p-1 rounded-full hover:bg-on-surface-variant/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
              tabIndex={-1}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
          {hasValue && !isError && !isWarning && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClear}
              className="text-on-surface-variant hover:text-foreground transition-colors p-1 rounded-full hover:bg-on-surface-variant/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
              tabIndex={-1}
              aria-label="Limpiar campo"
            >
              <CircleX className="h-5 w-5" />
            </button>
          )}
          {isError && <AlertCircle className="h-5 w-5 text-destructive" />}
          {!isError && isWarning && <TriangleAlert className="h-5 w-5 text-yellow-500" />}
        </div>
      </div>

      {isError && displayErrorText && (
        <div className="pt-1 px-4 text-xs font-medium text-destructive">
          {displayErrorText}
        </div>
      )}

      {!isError && isWarning && nativeWarning && (
        <div className="pt-1 px-4 text-xs font-medium text-yellow-600 dark:text-yellow-500">
          {nativeWarning}
        </div>
      )}
    </div>
  )
})
Input.displayName = "Input"

export { Input }
