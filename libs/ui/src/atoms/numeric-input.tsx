import * as numberInput from '@zag-js/number-input'
import { normalizeProps, useMachine } from '@zag-js/react'
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  type RefObject,
  createContext,
  useContext,
  useId,
} from 'react'
import { tv } from '../utils'
import { Button } from './button'
import type { IconType } from './icon'
import { Input } from './input'

const numericInputVariants = tv({
  slots: {
    root: ['flex relative'],
    container: [
      'flex relative border-(length:--border-width-ni)',
      'border-ni-border rounded-ni overflow-hidden items-center',
      'data-[invalid]:bg-ni-invalid-bg',
      'data-[invalid]:border-ni-invalid-border',
    ],
    input: [
      'p-ni-input',
      'bg-ni-input-bg border-none focus:bg-ni-input-bg-active hover:bg-ni-input-bg-hover',
      'focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
      'data-[invalid]:focus:border-input-border-danger-focus',
    ],
    triggerContainer: [
      'flex flex-col h-fit justify-center bg-ni-trigger-container',
    ],
    trigger: [
      'px-ni-trigger-x py-ni-trigger-y',
      'cursor-pointer focus:ring-increment-btn-ring',
    ],
    scrubber: 'absolute inset-0 cursor-ew-resize',
  },
  variants: {
    size: {
      sm: {
        root: 'text-ni-sm',
        trigger: 'text-ni-sm',
        input: 'text-ni-sm',
      },
      md: {
        root: 'text-ni-md',
        trigger: 'text-ni-md',
        input: 'text-ni-md',
      },
      lg: {
        root: 'text-ni-lg',
        trigger: 'text-ni-lg',
        input: 'text-ni-lg',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

// Context for sharing state between sub-components
interface NumericInputContextValue {
  api: ReturnType<typeof numberInput.connect>
  size?: 'sm' | 'md' | 'lg'
  styles: ReturnType<typeof numericInputVariants>
  invalid?: boolean
}

const NumericInputContext = createContext<NumericInputContextValue | null>(null)

function useNumericInputContext() {
  const context = useContext(NumericInputContext)
  if (!context) {
    throw new Error(
      'NumericInput components must be used within NumericInput.Root'
    )
  }
  return context
}

// Root component
export type NumericInputProps = numberInput.Props &
  ComponentPropsWithoutRef<'div'> & {
    size?: 'sm' | 'md' | 'lg'
    value?: number
    defaultValue?: number
    onChange?: (value: number) => void
    precision?: number
    children?: ReactNode
    ref?: RefObject<HTMLDivElement>
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
  dir = 'ltr',
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
    <NumericInputContext.Provider value={{ api, size, styles, invalid }}>
      <div
        ref={ref}
        className={styles.root({ className })}
        {...api.getRootProps()}
        {...props}
      >
        {children}
      </div>
    </NumericInputContext.Provider>
  )
}

// Control component (wrapper for input + triggers)
interface NumericInputControlProps extends ComponentPropsWithoutRef<'div'> {
  ref?: RefObject<HTMLDivElement>
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
      ref={ref}
      className={styles.container({ className })}
      {...api.getControlProps()}
      data-invalid={invalid || undefined}
      {...props}
    >
      {children}
    </div>
  )
}

// Input component
interface NumericInputInputProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  ref?: RefObject<HTMLInputElement>
}

NumericInput.Input = function NumericInputInput({
  ref,
  className,
  ...props
}: NumericInputInputProps) {
  const { api, styles } = useNumericInputContext()

  return (
    <Input
      ref={ref}
      {...props}
      {...api.getInputProps()}
      className={styles.input({ className })}
    />
  )
}

// Increment Trigger component
interface NumericInputIncrementTriggerProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  // === Button styling ===
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'warning'
  theme?: 'solid' | 'light' | 'borderless' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  uppercase?: boolean
  block?: boolean

  // === Icon ===
  icon?: IconType
  iconPosition?: 'left' | 'right'

  // === Loading state ===
  isLoading?: boolean
  loadingText?: string

  // === React ===
  ref?: RefObject<HTMLButtonElement>
  children?: ReactNode
}

NumericInput.IncrementTrigger = function NumericInputIncrementTrigger({
  // Button props with defaults
  variant = 'primary',
  theme = 'borderless',
  size = 'sm',
  icon = 'token-icon-ni-increment',
  iconPosition = 'left',
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
      ref={ref}
      variant={variant}
      theme={theme}
      size={size}
      icon={icon}
      iconPosition={iconPosition}
      uppercase={uppercase}
      block={block}
      isLoading={isLoading}
      loadingText={loadingText}
      className={styles.trigger({ className })}
      {...api.getIncrementTriggerProps()}
      {...props}
    >
      {children}
    </Button>
  )
}

// Decrement Trigger component
interface NumericInputDecrementTriggerProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  // === Button styling ===
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'warning'
  theme?: 'solid' | 'light' | 'borderless' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  uppercase?: boolean
  block?: boolean

  // === Icon ===
  icon?: IconType
  iconPosition?: 'left' | 'right'

  // === Loading state ===
  isLoading?: boolean
  loadingText?: string

  // === React ===
  ref?: RefObject<HTMLButtonElement>
  children?: ReactNode
}

NumericInput.DecrementTrigger = function NumericInputDecrementTrigger({
  // Button props with defaults
  variant = 'primary',
  theme = 'borderless',
  size = 'sm',
  icon = 'token-icon-ni-decrement',
  iconPosition = 'left',
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
      ref={ref}
      variant={variant}
      theme={theme}
      size={size}
      icon={icon}
      iconPosition={iconPosition}
      uppercase={uppercase}
      block={block}
      isLoading={isLoading}
      loadingText={loadingText}
      className={styles.trigger({ className })}
      {...api.getDecrementTriggerProps()}
      {...props}
    >
      {children}
    </Button>
  )
}

// Scrubber component (for drag-to-change functionality)
interface NumericInputScrubberProps extends ComponentPropsWithoutRef<'div'> {
  ref?: RefObject<HTMLDivElement>
}

NumericInput.Scrubber = function NumericInputScrubber({
  ref,
  className,
  ...props
}: NumericInputScrubberProps) {
  const { api, styles } = useNumericInputContext()

  return (
    <div
      ref={ref}
      className={styles.scrubber({ className })}
      {...api.getScrubberProps()}
      {...props}
    />
  )
}

// Trigger Container component (wrapper for increment/decrement triggers)
interface NumericInputTriggerContainerProps
  extends ComponentPropsWithoutRef<'div'> {
  ref?: RefObject<HTMLDivElement>
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
      ref={ref}
      className={styles.triggerContainer({ className })}
      {...props}
    >
      {children}
    </div>
  )
}

// Export main component with all subcomponents
NumericInput.displayName = 'NumericInput'
