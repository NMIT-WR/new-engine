import * as ratingGroup from '@zag-js/rating-group'
import { normalizeProps, useMachine } from '@zag-js/react'
import { type HTMLAttributes, useId } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from '../utils'
import { Label } from './label'

const rating = tv({
  slots: {
    root: ['grid items-center'],
    control: ['flex'],
    itemWrapper: [
      'flex items-center',
      'has-[:focus-visible]:outline-none',
      'has-[:focus-visible]:ring',
      'has-[:focus-visible]:ring-rating-ring',
    ],
    item: [
      'cursor-pointer transition-colors duration-200',
      'text-rating-fg',
      // States
      'data-[checked]:text-rating-fg-active',
      'data-[highlighted]:text-rating-fg-active',
      'data-[disabled]:cursor-not-allowed',
      'data-[disabled]:data-[highlighted]:text-rating-fg-disabled',
      'token-icon-rating',
      'data-[half]:token-icon-rating-half',
    ],
  },
  variants: {
    size: {
      sm: {
        root: 'gap-rating-sm',
        control: 'gap-rating-sm',
        item: 'text-rating-sm',
      },
      md: {
        root: 'gap-rating-md',
        control: 'gap-rating-md',
        item: 'text-rating-md',
      },
      lg: {
        root: 'gap-rating-lg',
        control: 'gap-rating-lg',
        item: 'text-rating-lg',
      },
    },
    isInteractive: {
      true: {},
      false: {
        item: 'cursor-default',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface RatingProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof rating> {
  value?: number
  defaultValue?: number
  count?: number
  labelText?: string
  readOnly?: boolean
  disabled?: boolean
  allowHalf?: boolean
  name?: string
  dir?: 'ltr' | 'rtl'
  translations?: ratingGroup.IntlTranslations
  onChange?: (value: number) => void
  onHoverChange?: (value: number) => void
}

export function Rating({
  value,
  defaultValue,
  count = 5,
  labelText,
  readOnly = false,
  disabled = false,
  allowHalf = true,
  name,
  dir = 'ltr',
  translations,
  onChange,
  onHoverChange,
  size = 'md',
  className,
  ...props
}: RatingProps) {
  const generatedId = useId()
  const uniqueId = props.id || generatedId

  const service = useMachine(ratingGroup.machine, {
    id: uniqueId,
    count,
    value,
    defaultValue,
    disabled,
    readOnly,
    allowHalf,
    name,
    dir,
    translations,
    onValueChange: ({ value }) => {
      onChange?.(value)
    },
    onHoverChange: ({ hoveredValue }) => {
      onHoverChange?.(hoveredValue)
    },
  })

  const api = ratingGroup.connect(service, normalizeProps)

  const { root, control, itemWrapper, item } = rating({
    size,
    isInteractive: !readOnly && !disabled,
  })

  return (
    <div className={root({ className })} {...api.getRootProps()} {...props}>
      {labelText && <Label {...api.getLabelProps()}>{labelText}</Label>}
      <input {...api.getHiddenInputProps()} />
      <div className={control()} {...api.getControlProps()}>
        {api.items.map((index) => (
          <div key={`star-${index}`} className={itemWrapper()}>
            <span className={item()} {...api.getItemProps({ index })} />
          </div>
        ))}
      </div>
    </div>
  )
}
