import type { ReactNode } from 'react'
import { ErrorText } from '../atoms/error-text'
import { ExtraText } from '../atoms/extra-text'
import { Label } from '../atoms/label'
import { NumericInput, type NumericInputProps } from '../atoms/numeric-input'

type ValidateStatus = 'default' | 'error' | 'success' | 'warning'

interface FormNumericInputProps extends Omit<NumericInputProps, 'children'> {
  // === Form-specific props ===
  id: string
  label: ReactNode
  validateStatus?: ValidateStatus
  helpText?: ReactNode
  extraText?: ReactNode

  // === Compound pattern ===
  children: ReactNode
}

export function FormNumericInput({
  id,
  label,
  validateStatus = 'default',
  helpText,
  extraText,
  size = 'md',
  required,
  disabled,
  children,
  ...numericInputProps
}: FormNumericInputProps) {
  const helpTextId = helpText ? `${id}-helper` : undefined
  const extraTextId = extraText ? `${id}-extra` : undefined

  return (
    <div
      className="flex flex-col gap-numeric-input-root-md data-[size=lg]:gap-numeric-input-root-lg data-[size=sm]:gap-numeric-input-root-sm"
      data-size={size}
    >
      <Label htmlFor={id} size={size} required={required} disabled={disabled}>
        {label}
      </Label>

      <NumericInput
        id={id}
        size={size}
        required={required}
        invalid={validateStatus === 'error'}
        disabled={disabled}
        {...numericInputProps}
      >
        {children}
      </NumericInput>

      {/* Error/Help text */}
      {helpText &&
        (validateStatus === 'error' ? (
          <ErrorText id={helpTextId} size={size} showIcon>
            {helpText}
          </ErrorText>
        ) : (
          <ExtraText id={helpTextId} size={size}>
            {helpText}
          </ExtraText>
        ))}

      {/* Extra text */}
      {extraText && (
        <ExtraText id={extraTextId} size={size}>
          {extraText}
        </ExtraText>
      )}
    </div>
  )
}
