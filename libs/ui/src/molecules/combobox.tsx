import * as combobox from '@zag-js/combobox'
import { createFilter } from '@zag-js/i18n-utils'
import { Portal, mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import { useId, useState } from 'react'
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
    root: ['flex flex-col relative w-full gap-combobox-root'],
    label: ['block text-label-md font-label mb-1'],
    control: [
      'flex items-center w-full relative',
      'bg-combobox border-(length:--border-width-combobox) border-combobox-border rounded-combobox',
      'transition-colors duration-200 ease-in-out',
      'data-[highlighted]:bg-combobox-hover data-[highlighted]:border-combobox-border-hover',
      'data-[focus]:bg-combobox-focus data-[focus]:border-combobox-border-focus',
      'data-[disabled]:bg-combobox-disabled data-[disabled]:border-combobox-border-disabled',
      'data-[validation=error]:border-combobox-danger data-[validation=error]:focus-within:ring-combobox-ring-danger',
      'data-[validation=success]:border-combobox-success data-[validation=success]:focus-within:ring-combobox-ring-success',
      'data-[validation=warning]:border-combobox-warning data-[validation=warning]:focus-within:ring-combobox-ring-warning',
    ],
    input: [
      'w-full relative border-none bg-transparent',
      'focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-combobox-input-bg-hover',
      'focus:bg-combobox-input-bg-focused',
      'py-input-md px-input-md',
      'placeholder:text-combobox-placeholder',
      'data-[disabled]:text-combobox-fg-disabled',
      'data-[disabled]:bg-combobox-disabled',
    ],
    clearTrigger: ['absolute right-combobox-trigger-right'],
    trigger: [
      'flex items-center justify-center',
      'px-0',
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
      'flex items-center px-combobox-item-lg py-combobox-item',
      'first:pt-combobox-item-lg last:pb-combobox-item-lg',
      'text-combobox-item-fg',
      'cursor-pointer',
      'data-[highlighted]:bg-combobox-item-hover',
      'data-[state=checked]:bg-combobox-item-selected',
      'data-[disabled]:text-combobox-fg-disabled data-[disabled]:cursor-not-allowed',
    ],
    helper: [
      'data-[validation=success]:text-combobox-success',
      'data-[validation=warning]:text-combobox-warning',
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
  size?: 'sm' | 'md' | 'lg'
  clearable?: boolean
  selectionBehavior?: 'replace' | 'clear' | 'preserve'
  closeOnSelect?: boolean
  allowCustomValue?: boolean
  loopFocus?: boolean
  autoFocus?: boolean
  disableFiltering?: boolean
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
  clearable = true,
  selectionBehavior = 'replace',
  closeOnSelect = false,
  allowCustomValue = false,
  loopFocus = true,
  autoFocus = false,
  disableFiltering = false,
  inputBehavior = 'autocomplete',
  onChange,
  onInputValueChange,
  onOpenChange,
}: ComboboxProps<T>) {
  const generatedId = useId()
  const uniqueId = id || generatedId

  const [filteredItems, setFilteredItems] = useState(items)

  const i18nFilter = createFilter({ sensitivity: 'base' })

  const collection = combobox.collection({
    items: filteredItems,
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
      let newFilteredItems: typeof items
      
      if (!disableFiltering && inputValue) {
        const filtered = items.filter((item) =>
          i18nFilter.contains(item.label, inputValue)
        )
        newFilteredItems = filtered.length > 0 ? filtered : items
      } else {
        newFilteredItems = items
      }
      
      setFilteredItems(newFilteredItems)
      onInputValueChange?.(inputValue)
    },
    onOpenChange: ({ open }) => {
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
  } = comboboxVariants()

  const customTriggerProps = mergeProps(api.getTriggerProps(), {
    onClick: () => {
      setFilteredItems(items)
    },
  })

  return (
    <div className={root()}>
      {label && (
        <Label className={labelStyles()} size={size} {...api.getLabelProps()}>
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
          {...customTriggerProps}
          theme="borderless"
          size={size}
          className={trigger()}
        >
          <Icon icon="token-icon-combobox-chevron" />
        </Button>
      </div>

      <Portal>
        <div {...api.getPositionerProps()} className={positioner()}>
          {api.open && filteredItems.length > 0 && (
            <ul {...api.getContentProps()} className={content()}>
              {filteredItems.map((item) => (
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
          {api.open && api.inputValue && filteredItems.length === 0 && (
            <div className={content()}>
              No results found for "{api.inputValue}"
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
