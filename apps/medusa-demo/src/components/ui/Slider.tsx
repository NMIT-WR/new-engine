import * as ReactAria from 'react-aria-components'
import { twMerge } from 'tailwind-merge'

export const UiSliderTrack: React.FC<ReactAria.SliderTrackProps> = ({
  className,
  ...props
}) => (
  <ReactAria.SliderTrack
    {...props}
    className={twMerge('h-px bg-black', className as string)}
  />
)

export const UiSliderThumb: React.FC<ReactAria.SliderThumbProps> = ({
  className,
  ...props
}) => (
  <ReactAria.SliderThumb
    {...props}
    className={twMerge(
      'h-4 w-4 cursor-pointer rounded-full border border-black bg-white',
      className as string
    )}
  />
)

export const UiSliderOutput: React.FC<ReactAria.SliderOutputProps> = ({
  className,
  ...props
}) => (
  <ReactAria.SliderOutput
    {...props}
    className={twMerge('mt-5 flex justify-between', className as string)}
  />
)

export const UiSliderOutputValue: React.FC<
  React.ComponentPropsWithoutRef<'span'>
> = ({ className, ...props }) => (
  <span {...props} className={twMerge('text-xs', className as string)} />
)
