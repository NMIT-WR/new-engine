import { buttonVariants } from '@techsio/ui-kit/atoms/button'
import { LinkButton } from '@techsio/ui-kit/atoms/link-button'
import { Tooltip } from '@techsio/ui-kit/atoms/tooltip'
import { tv } from '@techsio/ui-kit/utils'
import NextLink from 'next/link'
import type { ReactNode } from 'react'
import type { VariantProps } from 'tailwind-variants'

const linkWithTooltipButton = tv({
  extend: buttonVariants,
  base: [
    'p-lbwt bg-lbwt-bg text-lbwt-fg',
    'cursor-pointer',
    'font-normal',
    'hover:bg-lbwt-bg-hover',
  ],
  variants: {
    variant: {
      default: '',
      outline: [
        'border border-border-secondary',
        'data-[selected=true]:border-2 data-[selected=true]:bg-lbwt-bg-selected',
        'hover:border-border-primary',
        'data-[selected=true]:border-lbwt-border-selected',
      ],
    },
    size: {
      current: '',
    },
  },
  defaultVariants: {
    size: 'current',
    variant: 'outline',
  },
})

interface LinkButtonWithTooltipProps
  extends VariantProps<typeof linkWithTooltipButton> {
  children: ReactNode
  tooltip: ReactNode
  href: string
  placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
  selected?: boolean
}

export const LinkButtonWithTooltip = ({
  children,
  tooltip,
  href,
  placement,
  variant,
  size,
  selected = false,
}: LinkButtonWithTooltipProps) => {
  return (
    <Tooltip
      content={tooltip}
      placement={placement}
      variant="outline"
      offset={{ mainAxis: 4, crossAxis: 4 }}
    >
      <LinkButton
        as={NextLink}
        href={href}
        className={linkWithTooltipButton({ variant, size })}
        data-selected={selected}
      >
        {children}
      </LinkButton>
    </Tooltip>
  )
}
