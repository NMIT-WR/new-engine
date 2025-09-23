import type { HTMLAttributes } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from '../utils'

const badgeVariants = tv({
  base: [
    'inline-flex items-center justify-center',
    'p-badge',
    'rounded-badge border-badge-border',
    'text-badge-size font-badge',
    'border-(length:--border-width-badge-dynamic)',
  ],
  variants: {
    variant: {
      primary: [
        'bg-badge-bg-primary text-badge-fg-primary border-badge-border-primary',
      ],
      secondary: [
        'bg-badge-bg-secondary text-badge-fg-secondary border-badge-border-secondary',
      ],
      tertiary: [
        'bg-badge-bg-tertiary text-badge-fg-tertiary border-badge-border-tertiary',
      ],
      discount: [
        'bg-badge-bg-discount text-badge-fg-discount border-badge-border-discount',
      ],
      info: ['bg-badge-bg-info text-badge-fg-info border-badge-border-info'],
      success: [
        'bg-badge-bg-success text-badge-fg-success border-badge-border-success',
      ],
      warning: [
        'bg-badge-bg-warning text-badge-fg-warning border-badge-border-warning',
      ],
      danger: [
        'bg-badge-bg-danger text-badge-fg-danger border-badge-border-danger',
      ],
      outline: [
        'bg-badge-bg-outline text-badge-fg-outline border-badge-border-outline',
      ],
      dynamic: [],
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>

type BaseBadgeProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  'color' | 'children'
> & {
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
