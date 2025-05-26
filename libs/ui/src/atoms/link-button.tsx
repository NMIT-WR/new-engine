import type { HTMLAttributes, ReactNode, Ref } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from '../utils'
import { buttonVariants } from './button'
import { Icon, type IconType } from './icon'

const linkButton = tv({
  extend: buttonVariants,
  base: 'cursor-pointer',
  variants: {
    size: {
      current: 'text-current',
    },
  },
})

export interface LinkButtonProps
  extends HTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkButton> {
  href?: string
  icon?: IconType
  iconPosition?: 'left' | 'right'
  children?: ReactNode
  size?: 'current'
  disabled?: boolean
  ref?: Ref<HTMLAnchorElement>
}

export function LinkButton({
  href,
  icon,
  iconPosition = 'left',
  children,
  size = 'current',
  disabled,
  ref,
  ...props
}: LinkButtonProps) {
  return (
    <a
      ref={ref}
      className={linkButton()}
      href={disabled ? undefined : href}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      data-disabled={disabled || undefined}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault()
        }
      }}
      {...props}
    >
      {icon && iconPosition === 'left' && <Icon icon={icon} size={size} />}
      {children}
      {icon && iconPosition === 'right' && <Icon icon={icon} size={size} />}
    </a>
  )
}
