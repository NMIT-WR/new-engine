'use client'

import { Icon, type IconNames, type IconProps } from '@/components/Icon'
import * as ReactAria from 'react-aria-components'
import { twMerge } from 'tailwind-merge'

type UiSelectButtonOwnProps = {
  variant?: 'outline' | 'ghost'
}

export const UiSelectButton: React.FC<
  ReactAria.ButtonProps & UiSelectButtonOwnProps
> = ({ variant = 'outline', className, ...props }) => (
  <ReactAria.Button
    {...props}
    className={twMerge(
      'flex h-8 w-full items-center justify-between gap-1 px-3 transition-colors focus:border-grayscale-500 focus-visible:outline-none max-md:text-xs md:h-10 md:gap-2 md:pr-3 md:pl-4',
      variant === 'outline' &&
        'rounded-xs border border-grayscale-200 hover:border-grayscale-500 hover:text-grayscale-500',
      className as string
    )}
  />
)

export const UiSelectIcon: React.FC<
  Omit<IconProps, 'name'> & { name?: IconNames }
> = ({ name = 'chevron-down', className, ...props }) => (
  <Icon
    {...props}
    name={name}
    aria-hidden="true"
    className={twMerge('h-4 w-4 md:h-6 md:w-6', className)}
  />
)

export const UiSelectValue = <T extends object>({
  className,
  ...props
}: ReactAria.SelectValueProps<T>) => (
  <ReactAria.SelectValue
    {...props}
    className={twMerge('truncate', className as string)}
  />
)

export const UiSelectListBox = <T extends object>({
  className,
  ...props
}: ReactAria.ListBoxProps<T>) => (
  <ReactAria.ListBox
    {...props}
    className={twMerge(
      'max-h-50 overflow-scroll rounded-xs border border-grayscale-200 bg-white focus-visible:outline-none',
      className as string
    )}
  />
)

export const UiSelectListBoxItem: React.FC<ReactAria.ListBoxItemProps> = ({
  className,
  ...props
}) => (
  <ReactAria.ListBoxItem
    {...props}
    className={twMerge(
      'cursor-pointer p-4 transition-colors hover:bg-grayscale-50 focus-visible:outline-none data-[selected]:font-semibold',
      className as string
    )}
  />
)

export const UiSelectDialog: React.FC<ReactAria.DialogProps> = ({
  className,
  ...props
}) => (
  <ReactAria.Dialog
    {...props}
    className={twMerge(
      'rounded-xs border border-grayscale-200 bg-white focus-visible:outline-none',
      className
    )}
  />
)
