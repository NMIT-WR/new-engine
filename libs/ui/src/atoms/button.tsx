import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import type { VariantProps } from 'tailwind-variants';
import { tv } from '../utils';
import { Icon, type IconType } from './icon';

const buttonVariants = tv({
  base: [
    'relative',
    'inline-flex items-center justify-center cursor-pointer',
    'font-medium',
    'transition-all duration-200',
    'focus:outline-none',
    'focus-visible:ring-3 focus-visible:ring-offset-2',
    'disabled:text-btn-text-disabled disabled:pointer-events-none',
  ],
  variants: {
    variant: {
      primary: 'focus:ring-btn-ring-primary',
      secondary: 'focus:ring-btn-ring-secondary',
      tertiary: 'focus:ring-btn-ring-tertiary',
      danger: 'focus:ring-btn-ring-danger',
      warning: 'focus:ring-btn-ring-warning',
    },
    theme: {
      solid: 'disabled:bg-btn-disabled',
      light: 'disabled:bg-btn-disabled',
      borderless:
        'hover:bg-btn-borderless-hover active:bg-btn-borderless-active',
      outlined: 'border disabled:border-btn-border-disabled',
    },
    uppercase: {
      true: 'uppercase',
    },
    size: {
      sm: 'p-btn-sm text-btn-sm rounded-btn-sm gap-btn-sm',
      md: 'p-btn-md text-btn-md rounded-btn-md gap-btn-md',
      lg: 'p-btn-lg text-btn-lg rounded-btn-lg gap-btn-lg',
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
        'bg-btn-primary',
        'hover:bg-btn-primary-hover',
        'active:bg-btn-primary-active',
        'text-btn-text-primary',
      ],
    },
    {
      variant: 'secondary',
      theme: 'solid',
      className: [
        'bg-btn-secondary',
        'hover:bg-btn-secondary-hover',
        'active:bg-btn-secondary-active',
        'text-btn-text-secondary',
      ],
    },
    {
      variant: 'tertiary',
      theme: 'solid',
      className: [
        'bg-btn-tertiary',
        'hover:bg-btn-tertiary-hover',
        'active:bg-btn-tertiary-active',
        'text-btn-text-tertiary',
      ],
    },
    {
      variant: 'warning',
      theme: 'solid',
      className: [
        'bg-btn-warning',
        'hover:bg-btn-warning-hover',
        'active:bg-btn-warning-active',
        'text-btn-text-warning',
      ],
    },
    {
      variant: 'danger',
      theme: 'solid',
      className: [
        'bg-btn-danger',
        'hover:bg-btn-danger-hover',
        'active:bg-btn-danger-active',
        'text-btn-text-danger',
      ],
    },
    {
      variant: 'primary',
      theme: 'light',
      className: [
        'bg-btn-primary-light',
        'hover:bg-btn-primary-light-hover',
        'active:bg-btn-primary-light-active',
        'text-btn-text-primary-light',
      ],
    },
    {
      variant: 'secondary',
      theme: 'light',
      className: [
        'bg-btn-secondary-light',
        'hover:bg-btn-secondary-light-hover',
        'active:bg-btn-secondary-light-active',
        'text-btn-text-secondary-light',
      ],
    },
    {
      variant: 'tertiary',
      theme: 'light',
      className: [
        'bg-btn-tertiary-light',
        'hover:bg-btn-tertiary-light-hover',
        'active:bg-btn-tertiary-light-active',
        'text-btn-text-tertiary-light',
      ],
    },
    {
      variant: 'warning',
      theme: 'light',
      className: [
        'bg-btn-warning-light',
        'hover:bg-btn-warning-light-hover',
        'active:bg-btn-warning-light-active',
        'text-btn-text-warning-light',
      ],
    },
    {
      variant: 'danger',
      theme: 'light',
      className: [
        'bg-btn-danger-light',
        'hover:bg-btn-danger-light-hover',
        'active:bg-btn-danger-light-active',
        'text-btn-text-danger-light',
      ],
    },
    {
      variant: 'primary',
      theme: 'outlined',
      className: [
        'border-btn-border-primary',
        'hover:bg-btn-outlined-primary-hover',
        'active:bg-btn-outlined-primary-active',
        'text-btn-text-outlined-primary',
      ],
    },
    {
      variant: 'secondary',
      theme: 'outlined',
      className: [
        'border-btn-border-secondary',
        'hover:bg-btn-outlined-secondary-hover',
        'active:bg-btn-outlined-secondary-active',
        'text-btn-text-outlined-secondary',
      ],
    },
    {
      variant: 'tertiary',
      theme: 'outlined',
      className: [
        'border-btn-border-tertiary',
        'hover:bg-btn-outlined-tertiary-hover',
        'active:bg-btn-outlined-tertiary-active',
        'text-btn-text-outlined-tertiary',
      ],
    },
    {
      variant: 'warning',
      theme: 'outlined',
      className: [
        'border-btn-border-warning',
        'hover:bg-btn-outlined-warning-hover',
        'active:bg-btn-outlined-warning-active',
        'text-btn-text-outlined-warning',
      ],
    },
    {
      variant: 'danger',
      theme: 'outlined',
      className: [
        'border-btn-border-danger',
        'hover:bg-btn-outlined-danger-hover',
        'active:bg-btn-outlined-danger-active',
        'text-btn-text-outlined-danger',
      ],
    },
    {
      variant: 'primary',
      theme: 'borderless',
      className: ['text-btn-text-primary-borderless'],
    },
    {
      variant: 'secondary',
      theme: 'borderless',
      className: ['text-btn-text-secondary-borderless'],
    },
    {
      variant: 'tertiary',
      theme: 'borderless',
      className: ['text-btn-text-tertiary-borderless'],
    },
    {
      variant: 'warning',
      theme: 'borderless',
      className: ['text-btn-text-warning-borderless'],
    },
    {
      variant: 'danger',
      theme: 'borderless',
      className: ['text-btn-text-danger-borderless'],
    },
    {
      theme: 'outlined',
      size: 'sm',
      className: 'border-(length:--border-btn-width-sm)',
    },
    {
      theme: 'outlined',
      size: 'md',
      className: 'border-(length:--border-btn-width-md)',
    },
    {
      theme: 'outlined',
      size: 'lg',
      className: 'border-(length:--border-btn-width-lg)',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    theme: 'solid',
    size: 'md',
    light: false,
  },
});

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof buttonVariants> {
  icon?: IconType;
  iconPosition?: 'left' | 'right';
  uppercase?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  children?: ReactNode;
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
      {icon && iconPosition === 'left' && <Icon icon={icon} size={size} />}
      {children}
      {icon && iconPosition === 'right' && <Icon icon={icon} size={size} />}
    </button>
  );
}
