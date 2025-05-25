'use client'

import * as ReactAria from 'react-aria-components'
import { twMerge } from 'tailwind-merge'

type UiRadioOwnProps = {
  variant?: 'ghost' | 'outline'
}

export const UiRadioGroup: React.FC<ReactAria.RadioGroupProps> = ({
  ...props
}) => <ReactAria.RadioGroup {...props} />

export const UiRadio: React.FC<UiRadioOwnProps & ReactAria.RadioProps> = ({
  variant = 'ghost',
  className,
  ...props
}) => (
  <ReactAria.Radio
    {...props}
    className={twMerge(
      'group flex cursor-pointer items-center gap-2',
      variant === 'outline' &&
        'gap-4 border border-grayscale-200 p-4 transition-colors hover:border-grayscale-500',
      className as string
    )}
  />
)

export const UiRadioBox: React.FC<React.ComponentPropsWithoutRef<'span'>> = ({
  className,
  ...props
}) => (
  <span
    {...props}
    className={twMerge(
      'block h-4 w-4 rounded-full border border-grayscale-200 transition-colors group-hover:border-grayscale-600 group-data-[selected]:border-6 group-data-[selected]:border-black group-hover:group-data-[selected]:border-grayscale-600',
      className
    )}
  />
)

export const UiRadioLabel: React.FC<React.ComponentPropsWithoutRef<'span'>> = ({
  className,
  ...props
}) => <span {...props} className={className} />
