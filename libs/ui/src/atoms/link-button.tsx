import type {
  ComponentPropsWithoutRef,
  ElementType,
  MouseEvent,
  ReactNode,
} from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from '../utils'
import { buttonVariants } from './button'
import { Icon, type IconType } from './icon'
import { Link } from './link'

const linkButton = tv({
  extend: buttonVariants,
  base: 'cursor-pointer',
  variants: {
    size: {
      current: '',
    },
  },
  defaultVariants: {
    size: 'current',
  },
})

export type LinkButtonProps<T extends ElementType = 'a'> = VariantProps<
  typeof linkButton
> & {
  href?: string
  icon?: IconType
  iconPosition?: 'left' | 'right'
  children?: ReactNode
  disabled?: boolean
  uppercase?: boolean
  as?: T
} & Omit<
    ComponentPropsWithoutRef<T>,
    'as' | keyof VariantProps<typeof linkButton>
  >

export function LinkButton<T extends ElementType = 'a'>({
  href,
  icon,
  as,
  iconPosition = 'left',
  children,
  variant,
  theme,
  size,
  block,
  uppercase,
  className,
  disabled,
  ref,
  ...props
}: LinkButtonProps<T>) {
  return (
    <Link
      as={as as any}
      className={linkButton({
        variant,
        theme,
        size,
        block,
        uppercase,
        className,
      })}
      href={disabled ? undefined : href}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      data-disabled={disabled || undefined}
      onClick={(e: MouseEvent) => {
        if (disabled) {
          e.preventDefault()
        }
      }}
      {...props}
    >
      {icon && iconPosition === 'left' && <Icon icon={icon} size={size} />}
      {children}
      {icon && iconPosition === 'right' && <Icon icon={icon} size={size} />}
    </Link>
  )
}
