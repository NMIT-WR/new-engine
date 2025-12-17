import { connect, machine } from "@zag-js/checkbox"
import { normalizeProps, useMachine } from "@zag-js/react"
import { type ReactNode, useId } from "react"
import { ErrorText } from "../atoms/error-text"
import { ExtraText } from "../atoms/extra-text"
import { tv } from "../utils"

const checkboxVariants = tv({
  slots: {
    root: "flex items-center gap-form-checkbox-gap",
    control: [
      "relative shrink-0 cursor-pointer",
      "size-checkbox",
      "rounded-checkbox border border-checkbox-border",
      "bg-checkbox-bg",
      "flex items-center justify-center",
      "transition-all duration-200",
      "data-[state=checked]:bg-checkbox-bg-checked",
      "data-[state=checked]:border-checkbox-border-checked",
      "data-[state=indeterminate]:bg-checkbox-bg-indeterminate",
      "data-[state=indeterminate]:border-checkbox-border-indeterminate",
      "data-[disabled]:cursor-not-allowed",
      "data-[disabled]:bg-checkbox-bg-disabled",
      "data-[disabled]:border-checkbox-border-disabled",
      "data-[focus]:outline-none",
      "data-[focus]:ring",
      "data-[focus]:ring-checkbox-ring-focus",
      "data-[invalid]:border-checkbox-border-error",
      "data-[invalid]:ring-checkbox-ring-error",
    ],
    indicator: [
      "text-checkbox-fg-checked",
      "data-[state=checked]:token-icon-checkbox",
      "data-[state=indeterminate]:size-checkbox-indeterminate-icon",
      "data-[state=indeterminate]:rounded-full",
      "data-[state=indeterminate]:bg-checkbox-fg-indeterminate",
      "data-[disabled]:text-checkbox-fg-disabled",
    ],
    label: [
      "cursor-pointer select-none",
      "text-label-fg",
      "data-[disabled]:cursor-not-allowed",
      "data-[disabled]:text-label-fg-disabled",
    ],
    hiddenInput: "sr-only",
    textWrapper: "pl-form-checkbox-text-offset",
  },
  variants: {
    size: {
      sm: { label: "text-label-sm" },
      md: { label: "text-label-md" },
      lg: { label: "text-label-lg" },
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export type FormCheckboxProps = {
  id?: string
  name?: string
  value?: string
  checked?: boolean
  defaultChecked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  invalid?: boolean
  required?: boolean
  readOnly?: boolean
  children?: ReactNode
  label?: ReactNode
  helperText?: ReactNode
  errorText?: ReactNode
  helpText?: ReactNode
  extraText?: ReactNode
  validateStatus?: "default" | "error" | "success" | "warning"
  size?: "sm" | "md" | "lg"
  className?: string
  onCheckedChange?: (checked: boolean) => void
}

export function FormCheckbox({
  id,
  name,
  value,
  checked,
  defaultChecked,
  indeterminate,
  disabled = false,
  invalid = false,
  required = false,
  readOnly = false,
  children,
  label,
  helperText,
  errorText,
  helpText,
  extraText,
  validateStatus,
  size = "md",
  className,
  onCheckedChange,
}: FormCheckboxProps) {
  const generatedId = useId()
  const uniqueId = id || generatedId

  const isInvalid = validateStatus === "error" || invalid
  const resolvedErrorText = isInvalid ? (errorText ?? helpText) : undefined
  const resolvedHelperText = isInvalid ? undefined : (helperText ?? helpText)

  const service = useMachine(machine, {
    id: uniqueId,
    name,
    value,
    checked: indeterminate ? "indeterminate" : checked,
    defaultChecked,
    disabled,
    invalid: isInvalid,
    readOnly,
    required,
    onCheckedChange: (details) => {
      onCheckedChange?.(details.checked === true)
    },
  })

  const api = connect(service, normalizeProps)

  const styles = checkboxVariants({ size })

  const labelContent = label ?? children

  const hasText = extraText || resolvedErrorText || resolvedHelperText

  return (
    <div className={className}>
      <label className={styles.root()} {...api.getRootProps()}>
        <div className={styles.control()} {...api.getControlProps()}>
          <span className={styles.indicator()} {...api.getIndicatorProps()} />
        </div>
        <input
          className={styles.hiddenInput()}
          {...api.getHiddenInputProps()}
        />
        {labelContent && (
          <span className={styles.label()} {...api.getLabelProps()}>
            {labelContent}
            {required && <span className="text-label-fg-required"> *</span>}
          </span>
        )}
      </label>
      {hasText && (
        <div className={styles.textWrapper()}>
          {extraText && <ExtraText size={size}>{extraText}</ExtraText>}
          {isInvalid && resolvedErrorText && (
            <ErrorText showIcon size={size}>
              {resolvedErrorText}
            </ErrorText>
          )}
          {!isInvalid && resolvedHelperText && (
            <ExtraText size={size}>{resolvedHelperText}</ExtraText>
          )}
        </div>
      )}
    </div>
  )
}

FormCheckbox.displayName = "FormCheckbox"

export const FormCheckboxRaw = FormCheckbox
