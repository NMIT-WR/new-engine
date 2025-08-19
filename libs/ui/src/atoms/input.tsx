import type { InputHTMLAttributes, Ref } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from '../utils'

const inputVariants = tv({
  base: [
    'block w-full',
    'bg-input-bg',
    'text-input-fg',
    'placeholder:text-input-placeholder',
    'border border-input-border',
    'rounded-input',
    'transition-all duration-200 focus:outline-none',
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
        'focus-visible:ring-input-ring-error',
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
    context: {
      nested: 'border-none bg-transparent',
      standalone: [
        'hover:bg-input-bg-hover hover:border-input-border-hover',
        'focus:bg-input-bg-focus focus:border-input-border-focus',
        'focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-input-ring',
      ],
    },
    hideSearchClear: {
      true: '[&::-webkit-search-cancel-button]:hidden [&::-ms-clear]:hidden',
    },
    disabled: {
      true: [
        'bg-input-bg-disabled',
        'border-input-border-disabled',
        'text-input-fg-disabled',
        'placeholder:text-input-placeholder-disabled',
      ],
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
    hideSearchClear: true,
    context: 'standalone',
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
  context,
  disabled,
  ref,
  className,
  ...props
}: InputProps) {
  return (
    <input
      className={inputVariants({
        size,
        variant,
        context,
        disabled,
        className,
      })}
      disabled={disabled}
      ref={ref}
      {...props}
    />
  )
}
