import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from '../utils'
import { Icon, type IconType } from './icon'

export const buttonVariants = tv({
  base: [
    'relative',
    'inline-flex items-center justify-center cursor-pointer',
    'font-medium',
    'transition-all duration-200',
    'focus:outline-none',
    'focus-visible:ring-3 focus-visible:ring-offset-2',
    'disabled:text-button-fg-disabled disabled:pointer-events-none',
  ],
  variants: {
    variant: {
      primary: 'focus:ring-button-ring-primary',
      secondary: 'focus:ring-button-ring-secondary',
      tertiary: 'focus:ring-button-ring-tertiary',
      danger: 'focus:ring-button-ring-danger',
      warning: 'focus:ring-button-ring-warning',
    },
    theme: {
      solid: 'disabled:bg-button-bg-disabled',
      light: 'disabled:bg-button-bg-disabled',
      borderless:
        'bg-button-bg-borderless hover:bg-button-bg-borderless-hover active:bg-button-bg-borderless-active',
      outlined: 'border disabled:border-button-border-disabled',
    },
    uppercase: {
      true: 'uppercase',
    },
    size: {
      sm: 'p-button-sm text-button-sm rounded-button-sm gap-button-sm',
      md: 'p-button-md text-button-md rounded-button-md gap-button-md',
      lg: 'p-button-lg text-button-lg rounded-button-lg gap-button-lg',
    },

    block: {
      true: 'w-full',
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      theme: 'solid',
      className: [
        'bg-button-bg-primary',
        'hover:bg-button-bg-primary-hover',
        'active:bg-button-bg-primary-active',
        'text-button-fg-primary',
      ],
    },
    {
      variant: 'secondary',
      theme: 'solid',
      className: [
        'bg-button-bg-secondary',
        'hover:bg-button-bg-secondary-hover',
        'active:bg-button-bg-secondary-active',
        'text-button-fg-secondary',
      ],
    },
    {
      variant: 'tertiary',
      theme: 'solid',
      className: [
        'bg-button-bg-tertiary',
        'hover:bg-button-bg-tertiary-hover',
        'active:bg-button-bg-tertiary-active',
        'text-button-fg-tertiary',
      ],
    },
    {
      variant: 'warning',
      theme: 'solid',
      className: [
        'bg-button-bg-warning',
        'hover:bg-button-bg-warning-hover',
        'active:bg-button-bg-warning-active',
        'text-button-fg-warning',
      ],
    },
    {
      variant: 'danger',
      theme: 'solid',
      className: [
        'bg-button-bg-danger',
        'hover:bg-button-bg-danger-hover',
        'active:bg-button-bg-danger-active',
        'text-button-fg-danger',
      ],
    },
    {
      variant: 'primary',
      theme: 'light',
      className: [
        'bg-button-bg-primary-light',
        'hover:bg-button-bg-primary-light-hover',
        'active:bg-button-bg-primary-light-active',
        'text-button-fg-primary-light',
      ],
    },
    {
      variant: 'secondary',
      theme: 'light',
      className: [
        'bg-button-bg-secondary-light',
        'hover:bg-button-bg-secondary-light-hover',
        'active:bg-button-bg-secondary-light-active',
        'text-button-fg-secondary-light',
      ],
    },
    {
      variant: 'tertiary',
      theme: 'light',
      className: [
        'bg-button-bg-tertiary-light',
        'hover:bg-button-bg-tertiary-light-hover',
        'active:bg-button-bg-tertiary-light-active',
        'text-button-fg-tertiary-light',
      ],
    },
    {
      variant: 'warning',
      theme: 'light',
      className: [
        'bg-button-bg-warning-light',
        'hover:bg-button-bg-warning-light-hover',
        'active:bg-button-bg-warning-light-active',
        'text-button-fg-warning-light',
      ],
    },
    {
      variant: 'danger',
      theme: 'light',
      className: [
        'bg-button-bg-danger-light',
        'hover:bg-button-bg-danger-light-hover',
        'active:bg-button-bg-danger-light-active',
        'text-button-fg-danger-light',
      ],
    },
    {
      variant: 'primary',
      theme: 'outlined',
      className: [
        'border-button-border-primary',
        'hover:bg-button-bg-outlined-primary-hover',
        'active:bg-button-bg-outlined-primary-active',
        'text-button-fg-outlined-primary',
      ],
    },
    {
      variant: 'secondary',
      theme: 'outlined',
      className: [
        'border-button-border-secondary',
        'hover:bg-button-bg-outlined-secondary-hover',
        'active:bg-button-bg-outlined-secondary-active',
        'text-button-fg-outlined-secondary',
      ],
    },
    {
      variant: 'tertiary',
      theme: 'outlined',
      className: [
        'border-button-border-tertiary',
        'hover:bg-button-bg-outlined-tertiary-hover',
        'active:bg-button-bg-outlined-tertiary-active',
        'text-button-fg-outlined-tertiary',
      ],
    },
    {
      variant: 'warning',
      theme: 'outlined',
      className: [
        'border-button-border-warning',
        'hover:bg-button-bg-outlined-warning-hover',
        'active:bg-button-bg-outlined-warning-active',
        'text-button-fg-outlined-warning',
      ],
    },
    {
      variant: 'danger',
      theme: 'outlined',
      className: [
        'border-button-border-danger',
        'hover:bg-button-bg-outlined-danger-hover',
        'active:bg-button-bg-outlined-danger-active',
        'text-button-fg-outlined-danger',
      ],
    },
    {
      variant: 'primary',
      theme: 'borderless',
      className: ['text-button-fg-primary-borderless'],
    },
    {
      variant: 'secondary',
      theme: 'borderless',
      className: ['text-button-fg-secondary-borderless'],
    },
    {
      variant: 'tertiary',
      theme: 'borderless',
      className: ['text-button-fg-tertiary-borderless'],
    },
    {
      variant: 'warning',
      theme: 'borderless',
      className: ['text-button-fg-warning-borderless'],
    },
    {
      variant: 'danger',
      theme: 'borderless',
      className: ['text-button-fg-danger-borderless'],
    },
    {
      theme: 'outlined',
      size: 'sm',
      className: 'border-(length:--border-button-width-sm)',
    },
    {
      theme: 'outlined',
      size: 'md',
      className: 'border-(length:--border-button-width-md)',
    },
    {
      theme: 'outlined',
      size: 'lg',
      className: 'border-(length:--border-button-width-lg)',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    theme: 'solid',
    size: 'md',
    light: false,
  },
})

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof buttonVariants> {
  icon?: IconType
  iconPosition?: 'left' | 'right'
  uppercase?: boolean
  isLoading?: boolean
  loadingText?: string
  children?: ReactNode
}

export function Button({
  variant,
  theme,
  size,
  block,
  isLoading,
  icon,
  iconPosition = 'left',
  uppercase = false,
  children,
  className,
  ...props
}: ButtonProps & { ref?: Ref<HTMLButtonElement> }) {
  return (
    <button
      className={buttonVariants({
        variant,
        theme,
        size,
        block,
        uppercase,
        className,
      })}
      disabled={isLoading}
      {...props}
    >
      {icon && iconPosition === 'left' && <Icon icon={icon} />}
      {children}
      {icon && iconPosition === 'right' && <Icon icon={icon} />}
    </button>
  )
}
