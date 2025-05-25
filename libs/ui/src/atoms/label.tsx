import type { LabelHTMLAttributes, ReactNode } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from '../utils'

const labelVariants = tv({
  base: ['block', 'text-label-text', 'font-label'],
  variants: {
    size: {
      sm: 'text-label-sm',
      md: 'text-label-md',
      lg: 'text-label-lg',
      current: '',
    },
    disabled: {
      true: 'text-label-disabled',
    },
  },
  defaultVariants: {
    size: 'current',
    disabled: false,
  },
})

export interface LabelProps
  extends LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean
  children: ReactNode
}

export function Label({
  size,
  disabled,
  required,
  children,
  ...props
}: LabelProps) {
  return (
    <label
      className={labelVariants({
        size,
        disabled,
      })}
      htmlFor={props.htmlFor}
      {...props}
    >
      {children}
      {required && <span className="ml-label text-label-required">*</span>}
    </label>
  )
}
