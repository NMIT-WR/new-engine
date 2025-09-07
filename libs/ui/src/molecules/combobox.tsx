import * as combobox from '@zag-js/combobox'
import { Portal, normalizeProps, useMachine } from '@zag-js/react'
import { useEffect, useId, useState } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Button } from '../atoms/button'
import { ErrorText } from '../atoms/error-text'
import { ExtraText } from '../atoms/extra-text'
import { Icon } from '../atoms/icon'
import { Input } from '../atoms/input'
import { Label } from '../atoms/label'
import { tv } from '../utils'

const comboboxVariants = tv({
  slots: {
    root: ['flex flex-col relative w-full'],
    label: ['block text-label-md font-label'],
    control: [
      'flex items-center w-full relative',
      'bg-combobox-bg border-(length:--border-width-combobox) border-combobox-border rounded-combobox',
      'transition-colors duration-200 ease-in-out',
      'hover:bg-combobox-bg-hover hover:border-combobox-border-hover',
      'data-[focus]:bg-combobox-bg-focus data-[focus]:border-combobox-border-focus',
      'data-[disabled]:bg-combobox-bg-disabled data-[disabled]:border-combobox-border-disabled',
      'data-[validation=error]:border-combobox-danger-fg data-[validation=error]:focus-within:ring-combobox-ring-danger',
      'data-[validation=success]:border-combobox-success-fg data-[validation=success]:focus-within:ring-combobox-ring-success',
      'data-[validation=warning]:border-combobox-warning-fg data-[validation=warning]:focus-within:ring-combobox-ring-warning',
    ],
    input: [
      'w-full relative border-none bg-combobox-input-bg',
      'focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-combobox-input-bg-hover',
      'focus:bg-combobox-input-bg-focused',
      'placeholder:text-combobox-placeholder',
      'data-[disabled]:text-combobox-fg-disabled',
      'data-[disabled]:bg-combobox-bg-disabled',
    ],
    clearTrigger: ['absolute right-combobox-clear-right'],
    trigger: [
      'flex items-center justify-center',
      'p-combobox-trigger',
      'transition-transform duration-200',
      'data-[state=open]:rotate-180',
    ],
    positioner: [
      'z-(--z-index) w-full *:overflow-y-auto *:max-h-(--available-height)',
    ],
    content: [
      'flex flex-col overflow-clip',
      'rounded-combobox shadow-md',
      'bg-combobox-content-bg',
      'border border-combobox-border z-(--z-combobox-content)',
    ],
    item: [
      'flex items-center',
      'text-combobox-item-fg',
      'cursor-pointer',
      'data-[highlighted]:bg-combobox-item-bg-hover',
      'data-[state=checked]:bg-combobox-item-bg-selected',
      'data-[disabled]:text-combobox-fg-disabled data-[disabled]:cursor-not-allowed',
    ],
    helper: [
      'data-[validation=success]:text-combobox-success-fg',
      'data-[validation=warning]:text-combobox-warning-fg',
    ],
    multiple: [],
  },
  compoundSlots: [
    {
      slots: ['clearTrigger', 'trigger'],
      class: [
        'focus-visible:ring-0 focus-visible:ring-offset-0',
        'text-combobox-trigger text-combobox-trigger-size',
        'hover:text-combobox-trigger-hover',
        'px-combobox-trigger',
        'hover:bg-combobox-trigger-bg-hover',
        'focus-visible:outline-none',
        'active:bg-combobox-trigger-bg-active',
      ],
    },
  ],
  variants: {
    size: {
      sm: {
        root: 'gap-combobox-root-sm',
        item: 'p-combobox-item-sm',
        input: 'py-combobox-input-sm',
        content: 'text-combobox-content-sm',
      },
      md: {
        root: 'gap-combobox-root-md',
        item: 'p-combobox-item-md',
        input: 'py-combobox-input-md',
        content: 'text-combobox-content-md',
      },
      lg: {
        root: 'gap-combobox-root-lg',
        item: 'p-combobox-item-lg',
        input: 'py-combobox-input-lg',
        content: 'text-combobox-content-lg',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type ComboboxItem<T = unknown> = {
  id?: string
  label: string
  value: string
  disabled?: boolean
  data?: T
}

export interface ComboboxProps<T = unknown>
  extends VariantProps<typeof comboboxVariants> {
  id?: string
  name?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  items: ComboboxItem<T>[]
  value?: string | string[]
  defaultValue?: string | string[]
  inputValue?: string
  multiple?: boolean
  validationState?: 'normal' | 'error' | 'success' | 'warning'
  error?: string
  helper?: string
  noResultsMessage?: string
  clearable?: boolean
  selectionBehavior?: 'replace' | 'clear' | 'preserve'
  closeOnSelect?: boolean
  allowCustomValue?: boolean
  loopFocus?: boolean
  autoFocus?: boolean
  triggerIcon?: string
  clearIcon?: string
  onChange?: (value: string | string[]) => void
  onInputValueChange?: (value: string) => void
  onOpenChange?: (open: boolean) => void
  inputBehavior?: 'autohighlight' | 'autocomplete' | 'none'
}

export function Combobox<T = unknown>({
  id,
  name,
  label,
  size,
  placeholder = 'Select option',
  disabled = false,
  readOnly = false,
  required = false,
  items = [],
  value,
  defaultValue,
  inputValue,
  multiple = false,
  validationState = 'normal',
  error,
  helper,
  noResultsMessage = 'No results found for "{inputValue}"',
  clearable = true,
  selectionBehavior = 'replace',
  closeOnSelect = false,
  allowCustomValue = false,
  loopFocus = true,
  autoFocus = false,
  inputBehavior = 'autocomplete',
  onChange,
  onInputValueChange,
  onOpenChange,
}: ComboboxProps<T>) {
  const generatedId = useId()
  const uniqueId = id || generatedId

  const [options, setOptions] = useState(items)
  useEffect(() => {
    setOptions(items)
  }, [items])
  const collection = combobox.collection({
    items: options,
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
    isItemDisabled: (item) => !!item.disabled,
  })

  const service = useMachine(combobox.machine, {
    id: uniqueId,
    name,
    collection,
    disabled,
    readOnly,
    closeOnSelect,
    selectionBehavior,
    allowCustomValue,
    autoFocus,
    inputBehavior,
    loopFocus,
    ids: {
      label: `${uniqueId}-label`,
      input: `${uniqueId}-input`,
      control: `${uniqueId}-control`,
    },
    value: value as string[] | undefined,
    defaultValue: defaultValue as string[] | undefined,
    multiple,
    inputValue,
    onValueChange: ({ value: selectedValue }) => {
      onChange?.(selectedValue)
    },
    onInputValueChange: ({ inputValue }) => {
      const filtered = items.filter((item) =>
        item.label.toLowerCase().includes(inputValue.toLowerCase())
      )
      setOptions(filtered)
      onInputValueChange?.(inputValue)
    },
    onOpenChange: ({ open }) => {
      setOptions(items)
      onOpenChange?.(open)
    },
  })

  const api = combobox.connect(service, normalizeProps)

  const inputProps = api.getInputProps()
  const { ...restInputProps } = inputProps

  const {
    root,
    label: labelStyles,
    control,
    input,
    trigger,
    positioner,
    content,
    clearTrigger,
    item: itemSlot,
    helper: helperSlot,
  } = comboboxVariants({ size })

  return (
    <div className={root()}>
      {label && (
        <Label
          className={labelStyles()}
          size={size}
          required={required}
          {...api.getLabelProps()}
        >
          {label}
        </Label>
      )}
      <div
        className={control()}
        {...api.getControlProps()}
        data-validation={validationState}
      >
        <Input
          className={input()}
          {...restInputProps}
          placeholder={placeholder}
          name={name}
          required={required}
          size={size}
        />

        {clearable && api.value.length > 0 && (
          <Button
            className={clearTrigger()}
            theme="borderless"
            size={size}
            {...api.getClearTriggerProps()}
          >
            <Icon icon={'token-icon-combobox-clear'} size="current" />
          </Button>
        )}

        <Button
          {...api.getTriggerProps()}
          theme="borderless"
          size={size}
          className={trigger()}
        >
          <Icon icon="token-icon-combobox-chevron" />
        </Button>
      </div>

      <Portal>
        <div {...api.getPositionerProps()} className={positioner()}>
          {api.open && options.length > 0 && (
            <ul {...api.getContentProps()} className={content()}>
              {options.map((item) => (
                <li
                  key={item.value}
                  {...api.getItemProps({ item })}
                  className={itemSlot()}
                >
                  <span className="flex-1">{item.label}</span>
                </li>
              ))}
            </ul>
          )}
          {api.open && api.inputValue && options.length === 0 && (
            <div className={content()}>
              {noResultsMessage.replace('{inputValue}', api.inputValue)}
            </div>
          )}
        </div>
      </Portal>

      {helper && !error && (
        <ExtraText
          data-validation={validationState}
          size={size}
          className={helperSlot()}
        >
          {helper}
        </ExtraText>
      )}
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  )
}
