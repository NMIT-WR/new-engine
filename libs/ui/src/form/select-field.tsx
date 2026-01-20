import type { AnyFieldApi } from "@tanstack/react-form"
import { Select, type SelectItem, type SelectSize } from "../molecules/select"
import { getFieldStatus, getSelectFieldProps } from "./field-bindings"

export type SelectFieldProps = {
  field: AnyFieldApi
  label: string
  options: SelectItem[]
  required?: boolean
  disabled?: boolean
  placeholder?: string
  className?: string
  size?: SelectSize
  externalError?: string
  onExternalErrorClear?: () => void
}

export function SelectField({
  field,
  label,
  options,
  required,
  disabled,
  placeholder,
  className,
  size = "lg",
  externalError,
  onExternalErrorClear,
}: SelectFieldProps) {
  const fieldProps = getSelectFieldProps(field)
  const fieldStatus = getFieldStatus(field, {
    when: "blurred",
    externalError,
  })

  const handleValueChange = (details: { value: string[] }) => {
    fieldProps.onValueChange(details)
    if (externalError && onExternalErrorClear) {
      onExternalErrorClear()
    }
  }

  return (
    <Select
      items={options}
      disabled={disabled}
      id={fieldProps.id}
      name={fieldProps.name}
      onValueChange={handleValueChange}
      required={required}
      size={size}
      validateStatus={fieldStatus.validateStatus}
      value={fieldProps.value}
      className={className}
    >
      <Select.Label>{label}</Select.Label>
      <Select.Control>
        <Select.Trigger
          aria-describedby={fieldStatus["aria-describedby"]}
          aria-invalid={fieldStatus["aria-invalid"]}
        >
          <Select.ValueText placeholder={placeholder} />
        </Select.Trigger>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {options.map((item) => (
            <Select.Item key={item.value} item={item}>
              <Select.ItemText />
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
      {fieldStatus.errorMessage && (
        <Select.StatusText id={fieldStatus.errorId}>
          {fieldStatus.errorMessage}
        </Select.StatusText>
      )}
    </Select>
  )
}
