import { Icon, type IconNames } from '@/components/Icon'
import type * as React from 'react'
import { twMerge } from 'tailwind-merge'

type UiTagOwnProps = {
  isActive?: boolean
  iconName?: IconNames
  iconPosition?: 'start' | 'end'
}

export const UiTag: React.FC<
  React.ComponentPropsWithRef<'div'> & UiTagOwnProps
> = ({
  isActive = false,
  iconName,
  iconPosition,
  className,
  children,
  ...rest
}) => (
  <div
    {...rest}
    className={twMerge(
      'inline-flex max-h-6 items-center justify-center gap-2 rounded-md bg-grayscale-50 px-4 py-1.5 text-xs',
      isActive && 'bg-black text-white',
      iconPosition === 'end' && 'flex-row-reverse',
      className
    )}
  >
    {iconName && <Icon name={iconName} className="h-3 w-3" />}
    <span className="text-grayscale-200">{children}</span>
  </div>
)
