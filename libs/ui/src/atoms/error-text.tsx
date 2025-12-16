import type { HTMLAttributes, ReactNode, Ref } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from '../utils'
import { Icon } from './icon'

const errorVariants = tv({
  base: ['text-error-fg', 'flex items-center gap-error-icon-gap'],
  variants: {
    size: {
      sm: 'text-error-sm',
      md: 'text-error-md',
      lg: 'text-error-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface ErrorProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof errorVariants> {
  ref?: Ref<HTMLDivElement>
  showIcon?: boolean
  children: ReactNode
}

export function ErrorText({
  className,
  showIcon,
  children,
  ref,
  size,
  ...props
}: ErrorProps) {
  return (
    <div
      ref={ref}
      className={errorVariants({
        size,
        className,
      })}
      {...props}
    >
      {showIcon && <Icon icon="token-icon-error" />}
      <span>{children}</span>
    </div>
  )
}
