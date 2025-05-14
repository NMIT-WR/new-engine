"use client"

import * as ReactAria from "react-aria-components"
import { twMerge } from "tailwind-merge"

type UiRadioOwnProps = {
  variant?: "ghost" | "outline"
}

export const UiRadioGroup: React.FC<ReactAria.RadioGroupProps> = ({
  ...props
}) => <ReactAria.RadioGroup {...props} />

export const UiRadio: React.FC<UiRadioOwnProps & ReactAria.RadioProps> = ({
  variant = "ghost",
  className,
  ...props
}) => (
  <ReactAria.Radio
    {...props}
    className={twMerge(
      "flex gap-2 group cursor-pointer items-center",
      variant === "outline" &&
        "p-4 gap-4 border border-grayscale-200 hover:border-grayscale-500 transition-colors",
      className as string
    )}
  />
)

export const UiRadioBox: React.FC<React.ComponentPropsWithoutRef<"span">> = ({
  className,
  ...props
}) => (
  <span
    {...props}
    className={twMerge(
      "border border-grayscale-200 w-4 h-4 block transition-colors rounded-full group-hover:border-grayscale-600 group-data-[selected]:border-black group-data-[selected]:border-6 group-hover:group-data-[selected]:border-grayscale-600",
      className
    )}
  />
)

export const UiRadioLabel: React.FC<React.ComponentPropsWithoutRef<"span">> = ({
  className,
  ...props
}) => <span {...props} className={className} />
