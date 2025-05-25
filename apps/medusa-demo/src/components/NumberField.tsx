'use client'

import { Icon } from '@/components/Icon'
import * as ReactAria from 'react-aria-components'
import { twJoin, twMerge } from 'tailwind-merge'

export const NumberField: React.FC<
  ReactAria.NumberFieldProps & {
    size?: 'sm' | 'base'
  }
> = ({ size = 'base', className, ...rest }) => (
  <ReactAria.NumberField
    {...rest}
    className={twMerge(
      'flex justify-between rounded-xs border border-grayscale-200',
      size === 'sm' ? 'h-8 px-4' : 'h-12 px-6',
      className as string
    )}
  >
    <ReactAria.Button
      slot="decrement"
      className="shrink-0 transition-colors disabled:text-grayscale-200"
    >
      <Icon
        name="minus"
        className={twJoin(size === 'sm' ? 'h-4 w-4' : 'h-6 w-6')}
      />
    </ReactAria.Button>
    <ReactAria.Input
      className={twJoin(
        'w-7 text-center leading-none focus-within:outline-none disabled:bg-transparent disabled:text-grayscale-200',
        size === 'sm' ? 'text-xs' : 'text-sm'
      )}
    />
    <ReactAria.Button
      slot="increment"
      className="shrink-0 transition-colors disabled:text-grayscale-200"
    >
      <Icon
        name="plus"
        className={twJoin(size === 'sm' ? 'h-4 w-4' : 'h-6 w-6')}
      />
    </ReactAria.Button>
  </ReactAria.NumberField>
)
