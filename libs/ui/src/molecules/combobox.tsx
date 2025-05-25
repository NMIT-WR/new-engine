import * as combobox from '@zag-js/combobox'
import { normalizeProps, useMachine } from '@zag-js/react'
import { useId } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Button } from '../atoms/button'
import { Error } from '../atoms/error'
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
    clearTrigger: [
      // set styles for button in combobox
      'absolute right-combobox-trigger-right',
    ],
    trigger: [
      'flex items-center justify-center',
      'px-0',
      'transition-transform duration-200',
      'data-[state=open]:rotate-180',
    ],
    positioner: ['z-10 w-full'],
    content: [
      'flex flex-col overflow-clip',
      'rounded-combobox shadow-md',
      'bg-combobox-content-bg',
      'border border-combobox-border',
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

export type ComboboxItem<T = any> = {
  id: number
  label: string
  value: string
  disabled?: boolean
  data?: T
}

export interface ComboboxProps<T = any>
  extends VariantProps<typeof comboboxVariants> {
  //basic props
  id?: string
  name?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean

  //data and selection
  items: ComboboxItem<T>[]
  value?: string | string[]
  defaultValue?: string | string[]
  multiple?: boolean

  //validation and helper text
  validationState?: 'normal' | 'error' | 'success' | 'warning'
  error?: string
  helper?: string

  size?: 'sm' | 'md' | 'lg'

  //customization
  clearable?: boolean
  searchable?: boolean
  selectionBehavior?: 'replace' | 'clear' | 'preserve'
  closeOnSelect?: boolean
  allowCustomValue?: boolean

  // icons
  triggerIcon?: string
  clearIcon?: string

  // callbacks
  onChange?: (value: string | string[]) => void
  onInputValueChange?: (value: string) => void
  onOpenChange?: (open: boolean) => void
}

export function Combobox<T = any>({
  id,
  name,
  label,
  placeholder = 'Select option',
  disabled = false,
  readOnly = false,
  required = false,
  items = [],
  value,
  defaultValue,
  multiple = false,

  validationState = 'normal',
  error,
  helper,

  // machine settings
  clearable = true,
  selectionBehavior = 'replace',
  closeOnSelect = false,
  allowCustomValue = false,
  onChange,
  onInputValueChange,
  onOpenChange,
}: ComboboxProps<T>) {
  const generatedId = useId()
  const uniqueId = id || generatedId

  const collection = combobox.collection({
    items,
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
    isItemDisabled: (item) => !!item.disabled,
  })

  const service = useMachine(combobox.machine as any, {
    id: uniqueId,
    name,
    collection,
    disabled,
    readOnly,
    closeOnSelect,
    selectionBehavior,
    allowCustomValue,
    ids: {
      label: `${uniqueId}-label`,
      input: `${uniqueId}-input`,
      control: `${uniqueId}-control`,
    },
    value: value as string[],
    defaultValue: defaultValue as string[],
    multiple,
    onValueChange: ({ value }) => {
      onChange?.(value)
    },
    onInputValueChange: ({ inputValue }) => {
      onInputValueChange?.(inputValue)
    },
    onOpenChange: ({ open }) => {
      onOpenChange?.(open)
    },
  })

  const api = combobox.connect(service, normalizeProps)

  const inputProps = api.getInputProps()
  const { size: _inputSize, ...restInputProps } = inputProps

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

  return (
    <div className={root()}>
      {label && (
        <Label className={labelStyles()} {...api.getLabelProps()}>
          {label}
        </Label>
      )}
      <div
        className={control()}
        {...api.getControlProps()}
        // data-invalid={validationState === "error" || undefined}
        data-validation={validationState}
      >
        <Input
          className={input()}
          {...restInputProps}
          placeholder={placeholder}
          name={name}
          required={required}
        />

        {clearable && api.value && (
          <Button
            className={clearTrigger()}
            theme="borderless"
            size="sm"
            {...api.getClearTriggerProps()}
          >
            <Icon icon={'token-icon-combobox-clear'} size="current" />
          </Button>
        )}

        <Button
          {...api.getTriggerProps()}
          theme="borderless"
          className={trigger()}
        >
          <Icon icon="token-icon-combobox-chevron" />
        </Button>
      </div>

      {/* Dropdown content */}
      <div {...api.getPositionerProps()} className={positioner()}>
        {api.open && items.length > 0 && (
          <ul {...api.getContentProps()} className={content()}>
            {items.map((item) => (
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
      </div>
      {helper && !error && (
        <ExtraText data-validation={validationState} className={helperSlot()}>
          {helper}
        </ExtraText>
      )}
      {error && <Error>{error}</Error>}
      {multiple &&
        selectionBehavior === 'clear' &&
        api.selectedItems.length > 0 && (
          <ul className="mb-2 grid grid-cols-3 gap-1 ">
            {api.selectedItems.map((item) => (
              <li
                key={item.value}
                className="inline-flex items-center justify-between gap-1 rounded-combobox bg-combobox-item-selected px-2 py-1 text-combobox-item-fg text-sm"
              >
                <span>{item.label}</span>
                <button
                  type="button"
                  className="text-combobox-trigger hover:text-combobox-trigger-hover"
                  onClick={(e) => {
                    e.preventDefault()
                    api.clearValue(item.value)
                  }}
                  aria-label={`Odstranit ${item.label}`}
                >
                  <Icon icon="token-icon-combobox-clear" size="xs" />
                </button>
              </li>
            ))}
          </ul>
        )}
    </div>
  )
}
