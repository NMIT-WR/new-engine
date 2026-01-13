import * as numberInput from "@zag-js/number-input"
import { normalizeProps, useMachine } from "@zag-js/react"
import {
  type ComponentPropsWithoutRef,
  createContext,
  type ReactNode,
  type Ref,
  useContext,
  useId,
} from "react"
import { tv } from "../utils"
import { Button } from "./button"
import type { IconType } from "./icon"
import { Input } from "./input"

const numericInputVariants = tv({
  slots: {
    root: ["relative flex"],
    container: [
      "group border-(length:--border-width-numeric-input) relative flex",
      "items-center overflow-hidden rounded-numeric-input border-numeric-input-border",
      "data-invalid:bg-numeric-input-invalid-bg",
      "data-invalid:border-(length:--border-width-validation)",
      "data-invalid:border-numeric-input-invalid-border",
      "text-numeric-input-fg",
      "has-[input:not(:disabled):hover]:bg-numeric-input-input-bg-hover",
      "has-[input:focus]:bg-numeric-input-input-bg-focus",
      "focus-within:outline",
      "focus-within:outline-(length:--default-ring-width)",
      "focus-within:outline-numeric-input-ring",
      "focus-within:outline-offset-2",
    ],
    input: [
      "h-full rounded-none border-none pl-numeric-input-input",
      "bg-numeric-input-input-bg",
      "focus:bg-numeric-input-input-bg-focus",
      "hover:bg-numeric-input-input-bg-hover",
      "disabled:hover:bg-numeric-input-input-bg",
      "disabled:cursor-not-allowed",
      "focus-visible:outline-none",
      "duration-0 data-invalid:focus:border-input-border-danger-focus",
    ],
    triggerContainer: [
      "flex h-fit flex-col justify-center bg-numeric-input-trigger-container-bg",
    ],
    trigger: [
      "px-numeric-input-trigger-x py-numeric-input-trigger-y",
      "bg-numeric-input-trigger-bg hover:bg-numeric-input-trigger-bg-hover",
      "text-numeric-input-trigger-fg hover:text-numeric-input-trigger-fg-hover",
      "cursor-pointer",
      "disabled:cursor-not-allowed",
    ],
    scrubber: "absolute inset-0 cursor-ew-resize",
  },
  variants: {
    size: {
      sm: {
        root: "text-numeric-input-sm",
        trigger: "text-numeric-input-sm",
        input: "text-numeric-input-sm",
      },
      md: {
        root: "text-numeric-input-md",
        trigger: "text-numeric-input-md",
        input: "text-numeric-input-md",
      },
      lg: {
        root: "text-numeric-input-lg",
        trigger: "text-numeric-input-lg",
        input: "text-numeric-input-lg",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
})

// Context for sharing state between sub-components
interface NumericInputContextValue {
  api: ReturnType<typeof numberInput.connect>
  size?: "sm" | "md" | "lg"
  styles: ReturnType<typeof numericInputVariants>
  invalid?: boolean
  describedBy?: string
}

const NumericInputContext = createContext<NumericInputContextValue | null>(null)

function useNumericInputContext() {
  const context = useContext(NumericInputContext)
  if (!context) {
    throw new Error(
      "NumericInput components must be used within NumericInput.Root"
    )
  }
  return context
}

// Root component
export type NumericInputProps = Omit<
  numberInput.Props,
  "value" | "defaultValue" | "id"
> &
  Omit<ComponentPropsWithoutRef<"div">, "onChange" | "children"> & {
    size?: "sm" | "md" | "lg"
    value?: number
    defaultValue?: number
    onChange?: (value: number) => void
    precision?: number
    children?: ReactNode
    describedBy?: string
    ref?: Ref<HTMLDivElement>
    id?: string
    locale?: string
  }

export function NumericInput({
  id,
  name,
  size,
  disabled = false,
  required = false,
  pattern,
  readOnly,
  inputMode,
  value,
  defaultValue,
  onChange,
  dir = "ltr",
  describedBy,
  min,
  max,
  step = 1,
  precision,
  allowMouseWheel = true,
  allowOverflow,
  clampValueOnBlur = true,
  spinOnPress = true,
  formatOptions,
  invalid,
  children,
  ref,
  className,
  locale = "cs-CZ",
  ...props
}: NumericInputProps) {
  const generatedId = useId()
  const uniqueId = id || generatedId

  const stringValue = value !== undefined ? String(value) : undefined
  const stringDefaultValue =
    defaultValue !== undefined ? String(defaultValue) : undefined

  const service = useMachine(numberInput.machine, {
    id: uniqueId,
    min,
    max,
    step,
    name,
    disabled,
    locale,
    required,
    pattern,
    readOnly,
    inputMode,
    dir,
    invalid,
    value: stringValue,
    defaultValue: stringDefaultValue,
    allowMouseWheel,
    allowOverflow,
    clampValueOnBlur,
    spinOnPress,
    formatOptions: precision
      ? { maximumFractionDigits: precision }
      : formatOptions,
    onValueChange: (details) => {
      onChange?.(details.valueAsNumber)
    },
    focusInputOnChange: true,
  })

  const api = numberInput.connect(service, normalizeProps)
  const styles = numericInputVariants({ size })

  return (
    <NumericInputContext.Provider
      value={{ api, size, styles, invalid, describedBy }}
    >
      <div
        className={styles.root({ className })}
        ref={ref}
        {...api.getRootProps()}
        {...props}
      >
        {children}
      </div>
    </NumericInputContext.Provider>
  )
}

// Control component (wrapper for input + triggers)
interface NumericInputControlProps extends ComponentPropsWithoutRef<"div"> {
  ref?: Ref<HTMLDivElement>
}

NumericInput.Control = function NumericInputControl({
  children,
  ref,
  className,
  ...props
}: NumericInputControlProps) {
  const { api, styles, invalid } = useNumericInputContext()

  return (
    <div
      className={styles.container({ className })}
      ref={ref}
      {...api.getControlProps()}
      {...props}
      data-invalid={invalid || undefined}
    >
      {children}
    </div>
  )
}

// Input component
interface NumericInputInputProps
  extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  ref?: Ref<HTMLInputElement>
}

NumericInput.Input = function NumericInputInput({
  ref,
  className,
  ...props
}: NumericInputInputProps) {
  const { api, styles, describedBy } = useNumericInputContext()
  const ariaDescribedBy =
    [props["aria-describedby"], describedBy].filter(Boolean).join(" ") ||
    undefined

  return (
    <Input
      ref={ref}
      {...api.getInputProps()}
      {...props}
      aria-describedby={ariaDescribedBy}
      className={styles.input({ className })}
    />
  )
}

// Increment Trigger component
interface NumericInputIncrementTriggerProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children"> {
  // === Button styling ===
  variant?: "primary" | "secondary" | "tertiary" | "danger" | "warning"
  theme?: "solid" | "light" | "borderless" | "outlined"
  size?: "sm" | "md" | "lg"
  uppercase?: boolean
  block?: boolean

  // === Icon ===
  icon?: IconType
  iconPosition?: "left" | "right"

  // === Loading state ===
  isLoading?: boolean
  loadingText?: string

  // === React ===
  ref?: Ref<HTMLButtonElement>
  children?: ReactNode
}

NumericInput.IncrementTrigger = function NumericInputIncrementTrigger({
  // Button props with defaults
  variant = "primary",
  theme = "borderless",
  size = "sm",
  icon = "token-icon-numeric-input-increment",
  iconPosition = "left",
  uppercase,
  block,
  isLoading,
  loadingText,

  // React
  ref,
  className,
  children,
  ...props
}: NumericInputIncrementTriggerProps) {
  const { api, styles } = useNumericInputContext()

  return (
    <Button
      block={block}
      className={styles.trigger({ className })}
      icon={icon}
      iconPosition={iconPosition}
      isLoading={isLoading}
      loadingText={loadingText}
      ref={ref}
      size={size}
      theme={theme}
      uppercase={uppercase}
      variant={variant}
      {...api.getIncrementTriggerProps()}
      {...props}
    >
      {children}
    </Button>
  )
}

// Decrement Trigger component
interface NumericInputDecrementTriggerProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children"> {
  // === Button styling ===
  variant?: "primary" | "secondary" | "tertiary" | "danger" | "warning"
  theme?: "solid" | "light" | "borderless" | "outlined"
  size?: "sm" | "md" | "lg"
  uppercase?: boolean
  block?: boolean

  // === Icon ===
  icon?: IconType
  iconPosition?: "left" | "right"

  // === Loading state ===
  isLoading?: boolean
  loadingText?: string

  // === React ===
  ref?: Ref<HTMLButtonElement>
  children?: ReactNode
}

NumericInput.DecrementTrigger = function NumericInputDecrementTrigger({
  // Button props with defaults
  variant = "primary",
  theme = "borderless",
  size = "sm",
  icon = "token-icon-numeric-input-decrement",
  iconPosition = "left",
  uppercase,
  block,
  isLoading,
  loadingText,

  // React
  ref,
  className,
  children,
  ...props
}: NumericInputDecrementTriggerProps) {
  const { api, styles } = useNumericInputContext()

  return (
    <Button
      block={block}
      className={styles.trigger({ className })}
      icon={icon}
      iconPosition={iconPosition}
      isLoading={isLoading}
      loadingText={loadingText}
      ref={ref}
      size={size}
      theme={theme}
      uppercase={uppercase}
      variant={variant}
      {...api.getDecrementTriggerProps()}
      {...props}
    >
      {children}
    </Button>
  )
}

// Scrubber component (for drag-to-change functionality)
interface NumericInputScrubberProps extends ComponentPropsWithoutRef<"div"> {
  ref?: Ref<HTMLDivElement>
}

NumericInput.Scrubber = function NumericInputScrubber({
  ref,
  className,
  ...props
}: NumericInputScrubberProps) {
  const { api, styles } = useNumericInputContext()

  return (
    <div
      className={styles.scrubber({ className })}
      ref={ref}
      {...api.getScrubberProps()}
      {...props}
    />
  )
}

// Trigger Container component (wrapper for increment/decrement triggers)
interface NumericInputTriggerContainerProps
  extends ComponentPropsWithoutRef<"div"> {
  ref?: Ref<HTMLDivElement>
}

NumericInput.TriggerContainer = function NumericInputTriggerContainer({
  children,
  ref,
  className,
  ...props
}: NumericInputTriggerContainerProps) {
  const { styles } = useNumericInputContext()

  return (
    <div
      className={styles.triggerContainer({ className })}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
}

// Export main component with all subcomponents
NumericInput.displayName = "NumericInput"
