import { Portal, normalizeProps, useMachine } from '@zag-js/react'
import * as select from '@zag-js/select'
import { type ReactNode, useId } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'
import { Button } from '../atoms/button'
import { ErrorText } from '../atoms/error-text'
import { ExtraText } from '../atoms/extra-text'
import { Icon } from '../atoms/icon'
import { Label } from '../atoms/label'

// === TYPES ===
export interface SelectOption {
  label: ReactNode
  value: string
  disabled?: boolean
  displayValue?: string // Plain text representation for accessibility/forms
  [key: string]: unknown
}

// === COMPONENT VARIANTS ===
const selectVariants = tv({
  slots: {
    root: [
      'relative',
      'flex flex-col gap-select-root',
      'w-full',
      'bg-select-root-bg',
    ],
    control: ['flex relative items-center justify-between', 'w-full'],
    positioner: ['w-(--reference-width)', 'isolate z-(--z-index)'],
    trigger: [
      'w-full',
      'p-select-trigger',
      'border border-select-trigger-border rounded-select',
      'text-select-trigger-size text-left',
      'hover:bg-select-trigger-bg-hover',
      'focus:outline-none focus:border-select-trigger-border-focus',
      'data-[disabled]:cursor-not-allowed',
      'data-[invalid]:border-select-danger data-[invalid]:ring-select-danger',
    ],
    clearTrigger: [
      'absolute right-select-right h-full',
      'p-select-clear-trigger',
      'hover:bg-select-clear-trigger-bg',
      'text-select-clear-trigger-fg hover:text-select-danger',
      'focus:text-select-danger',
      'focus:outline-none focus:ring-offset-transparent focus:ring-transparent',
    ],
    content: [
      'bg-select-content-bg border border-select-content-border',
      'rounded-select shadow-select-content max-h-fit',
      'h-[calc(var(--available-height)-var(--spacing-content))]',
      'overflow-auto z-(--z-content)',
    ],
    item: [
      'flex items-center justify-between',
      'bg-select-item-bg cursor-pointer',
      'p-select-item',
      'text-select-item-fg',
      'hover:bg-select-item-bg-hover',
      'data-[state=checked]:bg-select-item-bg-selected',
      'data-[state=checked]:text-select-item-selected-fg',
      'data-[disabled]:opacity-select-disabled data-[disabled]:cursor-not-allowed',
    ],
    itemIndicator: ['text-select-indicator'],
    value: ['flex-grow truncate data-[placeholder]:text-select-placeholder'],
  },
  variants: {
    size: {
      xs: {
        trigger: 'text-select-xs',
        item: 'text-select-xs',
        value: 'text-select-xs',
      },
      sm: {
        trigger: 'text-select-sm',
        item: 'text-select-sm',
        value: 'text-select-sm',
      },
      md: {
        trigger: 'text-select-md',
        item: 'text-select-md',
        value: 'text-select-md',
      },
      lg: {
        trigger: 'text-select-lg',
        item: 'text-select-lg',
        value: 'text-select-lg',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

// === COMPONENT PROPS ===
export interface SelectProps
  extends VariantProps<typeof selectVariants>,
    Omit<select.Props, 'collection' | 'id'> {
  options: SelectOption[]
  label?: ReactNode
  placeholder?: string
  helperText?: string
  errorText?: string
  className?: string
  id?: string
  clearIcon?: boolean
}

export function Select({
  options,
  label,
  placeholder = 'Select an option',
  size = 'md',
  value,
  defaultValue,
  multiple = false,
  clearIcon = true,
  disabled = false,
  invalid = false,
  required = false,
  readOnly = false,
  errorText,
  helperText,
  closeOnSelect = true,
  loopFocus = true,
  name,
  form,
  onValueChange,
  onOpenChange,
  onHighlightChange,
  onSelect,
  className,
  id: providedId,
}: SelectProps) {
  const generatedId = useId()
  const id = providedId || generatedId

  const collection = select.collection({
    items: options,
    itemToString: (item) => item.displayValue || item.value,
    itemToValue: (item) => item.value,
    isItemDisabled: (item) => !!item.disabled,
  })

  const service = useMachine(select.machine, {
    id,
    collection,
    name,
    form,
    multiple,
    disabled,
    invalid,
    required,
    readOnly,
    closeOnSelect,
    loopFocus,
    defaultValue,
    value,
    onValueChange,
    onOpenChange,
    onHighlightChange,
    onSelect,
  })

  const api = select.connect(service as select.Service, normalizeProps)

  const {
    root,
    control,
    trigger,
    clearTrigger,
    content,
    positioner,
    item,
    itemIndicator,
    value: valueSlot,
  } = selectVariants({ size })

  return (
    <>
      {/* Hidden form select for native form submission */}
      <select {...api.getHiddenSelectProps()}>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.displayValue || option.value}
          </option>
        ))}
      </select>

      <div className={root({ className })} {...api.getRootProps()}>
        {label && <Label {...api.getLabelProps()}>{label}</Label>}
        <div className={control()} {...api.getControlProps()}>
          <Button
            theme="borderless"
            className={trigger()}
            {...api.getTriggerProps()}
            icon={
              api.open
                ? 'token-icon-select-indicator-open'
                : 'token-icon-select-indicator'
            }
            iconPosition="right"
          >
            <span
              className={valueSlot()}
              data-placeholder={api.value.length === 0}
            >
              {api.value.length > 0
                ? // Find option as selected value and render same label
                  options.find((option) => option.value === api.value[0])?.label
                : placeholder}
            </span>
          </Button>
          {clearIcon && (
            <Button
              theme="borderless"
              {...api.getClearTriggerProps()}
              className={clearTrigger()}
              aria-label="Clear selection"
              icon="token-icon-select-clear"
            />
          )}
        </div>
        {/* Dropdown content portal */}
        <Portal>
          <div className={positioner()} {...api.getPositionerProps()}>
            <ul className={content()} {...api.getContentProps()}>
              {options.map((option) => (
                <li
                  key={option.value}
                  className={item()}
                  {...api.getItemProps({ item: option })}
                >
                  <span {...api.getItemTextProps({ item: option })}>
                    {option.label}
                  </span>
                  <span
                    className={itemIndicator()}
                    {...api.getItemIndicatorProps({ item: option })}
                  >
                    <Icon icon="token-icon-select-check" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Portal>

        {invalid && <ErrorText>{errorText}</ErrorText>}
        {!invalid && helperText && <ExtraText>{helperText}</ExtraText>}
      </div>
    </>
  )
}

Select.displayName = 'Select'
