'use client'

import { Icon, type IconNames, type IconProps } from '@/components/Icon'
import * as ReactAria from 'react-aria-components'
import { twMerge } from 'tailwind-merge'

export const UiCheckbox: React.FC<ReactAria.CheckboxProps> = ({
  className,
  ...props
}) => (
  <ReactAria.Checkbox
    {...props}
    className={twMerge(
      'group flex cursor-pointer items-center gap-2',
      className as string
    )}
  />
)

export const UiCheckboxBox: React.FC<React.ComponentPropsWithoutRef<'div'>> = ({
  className,
  ...props
}) => (
  <div
    {...props}
    className={twMerge(
      'flex h-4 w-4 items-center justify-center border border-grayscale-200 transition-colors group-hover:border-grayscale-600 group-data-[selected=true]:border-black group-data-[selected=true]:bg-black group-hover:group-data-[selected=true]:border-grayscale-600 group-hover:group-data-[selected=true]:bg-grayscale-600',
      className
    )}
  />
)

export const UiCheckboxIcon: React.FC<
  Omit<IconProps, 'name'> & { name?: IconNames }
> = ({ name = 'check', className, ...props }) => (
  <Icon
    {...props}
    name={name}
    className={twMerge(
      'h-3 w-3 text-white group-data-[selected=false]:opacity-0 group-data-[selected=true]:opacity-1',
      className
    )}
  />
)

export const UiCheckboxLabel: React.FC<
  React.ComponentPropsWithoutRef<'span'>
> = ({ className, ...props }) => <span {...props} className={className} />
