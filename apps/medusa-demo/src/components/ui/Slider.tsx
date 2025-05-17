import * as ReactAria from "react-aria-components"
import { twMerge } from "tailwind-merge"

export const UiSliderTrack: React.FC<ReactAria.SliderTrackProps> = ({
  className,
  ...props
}) => (
  <ReactAria.SliderTrack
    {...props}
    className={twMerge("h-px bg-black", className as string)}
  />
)

export const UiSliderThumb: React.FC<ReactAria.SliderThumbProps> = ({
  className,
  ...props
}) => (
  <ReactAria.SliderThumb
    {...props}
    className={twMerge(
      "w-4 h-4 border border-black bg-white rounded-full cursor-pointer",
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
    className={twMerge("flex justify-between mt-5", className as string)}
  />
)

export const UiSliderOutputValue: React.FC<
  React.ComponentPropsWithoutRef<"span">
> = ({ className, ...props }) => (
  <span {...props} className={twMerge("text-xs", className as string)} />
)
