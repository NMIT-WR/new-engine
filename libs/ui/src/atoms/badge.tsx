import type { HTMLAttributes } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from '../utils'

const badgeVariants = tv({
  base: [
    'inline-flex items-center justify-center',
    'px-badge-x py-badge-y',
    'rounded-badge border-badge',
    'text-badge-size font-badge',
    'border-(length:--border-width-badge-dynamic)',
  ],
  variants: {
    variant: {
      primary: [
        'bg-badge-primary-bg text-badge-primary-fg border-badge-border-primary',
      ],
      secondary: [
        'bg-badge-secondary-bg text-badge-secondary-fg border-badge-border-secondary',
      ],
      tertiary: [
        'bg-badge-tertiary-bg text-badge-tertiary-fg border-badge-border-tertiary',
      ],
      discount: [
        'bg-badge-discount-bg text-badge-discount-fg border-badge-border-discount',
      ],
      info: ['bg-badge-info-bg text-badge-info-fg border-badge-border-info'],
      success: [
        'bg-badge-success-bg text-badge-success-fg border-badge-border-success',
      ],
      warning: [
        'bg-badge-warning-bg text-badge-warning-fg border-badge-border-warning',
      ],
      danger: [
        'bg-badge-danger-bg text-badge-danger-fg border-badge-border-danger',
      ],
      outline: [
        'bg-badge-outline-bg text-badge-outline-fg border-badge-border-outline',
      ],
      dynamic: [],
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>

type BaseBadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, 'color'> & {
  className?: string
  children: string
}

type DefaultBadgeProps = BaseBadgeProps & {
  variant?: Exclude<BadgeVariant, 'dynamic'>
}

type DynamicBadgeProps = BaseBadgeProps & {
  variant: 'dynamic'
  bgColor: string
  fgColor: string
  borderColor: string
}

export type BadgeProps = DefaultBadgeProps | DynamicBadgeProps

export function Badge({
  variant,
  className,
  children,
  style,
  ...props
}: BadgeProps) {
  const isDynamic = variant === 'dynamic'

  const { bgColor, fgColor, borderColor, ...restProps } =
    props as Partial<DynamicBadgeProps>

  const dynamicStyles = isDynamic
    ? {
        ...style,
        'background-color': bgColor,
        color: fgColor,
        'border-color': borderColor,
      }
    : style

  return (
    <span
      className={badgeVariants({ variant, className })}
      style={dynamicStyles}
      {...restProps}
    >
      {children}
    </span>
  )
}
