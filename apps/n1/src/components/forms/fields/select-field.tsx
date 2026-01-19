"use client"

import type { AnyFieldApi } from "@tanstack/react-form"
import {
  getFieldStatus,
  getSelectFieldProps,
} from "@techsio/ui-kit/form/field-bindings"
import { Select } from "@ui/molecules/select"

type SelectOption = {
  value: string
  label: string
}

type SelectFieldProps = {
  field: AnyFieldApi
  label: string
  options: SelectOption[]
  required?: boolean
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function SelectField({
  field,
  label,
  options,
  required,
  disabled,
  placeholder,
  className,
}: SelectFieldProps) {
  const fieldProps = getSelectFieldProps(field)
  const fieldStatus = getFieldStatus(field, { when: "blurred" })

  return (
    <Select
      aria-describedby={fieldStatus["aria-describedby"]}
      aria-invalid={fieldStatus["aria-invalid"]}
      items={options}
      disabled={disabled}
      id={fieldProps.id}
      name={fieldProps.name}
      onValueChange={fieldProps.onValueChange}
      required={required}
      size="lg"
      validateStatus={fieldStatus.validateStatus}
      value={fieldProps.value}
      className={className}
    >
      <Select.Label>{label}</Select.Label>
      <Select.Control>
        <Select.Trigger>
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
