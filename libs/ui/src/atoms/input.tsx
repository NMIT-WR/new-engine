import type { InputHTMLAttributes, Ref } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from '../utils'

const inputVariants = tv({
  base: [
    'block w-full',
    'bg-input',
    'text-input-text',
    'placeholder:text-input-placeholder',
    'border border-input-border',
    'rounded-input',
    'transition-all duration-200',
    'hover:bg-input-hover hover:border-input-border-hover',
    'focus:outline-none focus:bg-input-focus focus:border-input-border-focus',
    'focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-input-ring',
    'disabled:pointer-events-none',
  ],
  variants: {
    size: {
      sm: 'p-input-sm text-input-sm',
      md: 'p-input-md text-input-md',
      lg: 'p-input-lg text-input-lg',
    },
    variant: {
      default: '',
      error: [
        'border-input-border-danger',
        'hover:border-input-border-danger-hover',
        'focus:border-input-border-danger-focus',
        'focus-visible:ring-input-ring-danger',
        'placeholder:text-input-placeholder-danger',
      ],
      success: [
        'border-input-border-success',
        'hover:border-input-border-success-hover',
        'focus:border-input-border-success-focus',
        'focus-visible:ring-input-ring-success',
        'placeholder:text-input-placeholder-success',
      ],
      warning: [
        'border-input-border-warning',
        'hover:border-input-border-warning-hover',
        'focus:border-input-border-warning-focus',
        'focus-visible:ring-input-ring-warning',
        'placeholder:text-input-placeholder-warning',
      ],
    },
    withButtonInside: {
      false: '',
      right: 'pr-with-button',
      left: 'pl-with-button',
    },
    hideSearchClear: {
      true: '[&::-webkit-search-cancel-button]:hidden [&::-ms-clear]:hidden',
    },
    disabled: {
      true: [
        'bg-input-disabled',
        'border-input-border-disabled',
        'text-input-text-disabled',
        'placeholder:text-input-placeholder-disabled',
      ],
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
    hideSearchClear: true,
    withIconInside: false,
  },
})

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  ref?: Ref<HTMLInputElement>
}

export function Input({
  size,
  variant,
  disabled,
  ref,
  withButtonInside,
  className,
  ...props
}: InputProps) {
  return (
    <input
      className={inputVariants({
        size,
        variant,
        disabled,
        withButtonInside,
        className,
      })}
      disabled={disabled}
      ref={ref}
      {...props}
    />
  )
}
