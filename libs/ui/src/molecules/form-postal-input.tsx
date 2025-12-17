import {
  formatPostalCode,
  getPostalCodeInputMode,
  getPostalCodeMaxLength,
  getPostalCodePlaceholder,
} from "@techsio/address/postal-code/format"
import type { ReactNode, Ref } from "react"
import { ErrorText } from "../atoms/error-text"
import { ExtraText } from "../atoms/extra-text"
import { Input, type InputProps } from "../atoms/input"
import { Label } from "../atoms/label"

type ValidateStatus = "default" | "error" | "success" | "warning"

export interface FormPostalInputProps
  extends Omit<
    InputProps,
    "type" | "inputMode" | "maxLength" | "autoComplete"
  > {
  id: string
  label: ReactNode
  /** Country code for validation/formatting (e.g., "CZ", "US") */
  countryCode?: string
  validateStatus?: ValidateStatus
  /** Help text shown when not in error state */
  helpText?: ReactNode
  /** Error text shown when validateStatus is "error" */
  errorText?: ReactNode
  extraText?: ReactNode
  /** Called when value changes */
  onValueChange?: (value: string) => void
  /** Called on blur with formatted value */
  onFormat?: (formattedValue: string) => void
  ref?: Ref<HTMLInputElement>
}

export function FormPostalInput({
  id,
  label,
  countryCode = "CZ",
  validateStatus = "default",
  helpText,
  errorText,
  extraText,
  size = "md",
  required,
  disabled,
  onValueChange,
  onFormat,
  onBlur,
  onChange,
  value,
  placeholder,
  ref,
  ...props
}: FormPostalInputProps) {
  const helperId = helpText || errorText ? `${id}-helper` : undefined
  const extraTextId = extraText ? `${id}-extra` : undefined

  // Get country-specific config
  const maxLength = getPostalCodeMaxLength(countryCode)
  const inputMode = getPostalCodeInputMode(countryCode)
  const defaultPlaceholder =
    placeholder ?? getPostalCodePlaceholder(countryCode)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
    onValueChange?.(e.target.value)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Auto-format on blur
    if (e.target.value && countryCode) {
      const formatted = formatPostalCode(e.target.value, countryCode)
      if (formatted !== e.target.value) {
        onFormat?.(formatted)
      }
    }
    onBlur?.(e)
  }

  return (
    <div className="flex flex-col gap-form-field-gap">
      <Label disabled={disabled} htmlFor={id} required={required} size={size}>
        {label}
      </Label>
      <Input
        autoComplete="postal-code"
        disabled={disabled}
        id={id}
        inputMode={inputMode}
        maxLength={maxLength}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder={defaultPlaceholder}
        ref={ref}
        required={required}
        size={size}
        value={value}
        variant={validateStatus}
        {...props}
      />

      {/* Error text */}
      {validateStatus === "error" && errorText && (
        <ErrorText id={helperId} showIcon size={size}>
          {errorText}
        </ErrorText>
      )}
      {/* Help text */}
      {validateStatus !== "error" && helpText && (
        <ExtraText id={helperId} size={size}>
          {helpText}
        </ExtraText>
      )}

      {/* Extra text */}
      {extraText && (
        <ExtraText id={extraTextId} size={size}>
          {extraText}
        </ExtraText>
      )}
    </div>
  )
}

FormPostalInput.displayName = "FormPostalInput"
