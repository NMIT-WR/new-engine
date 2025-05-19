"use client"

import * as ReactAria from "react-aria-components"
import { twJoin, twMerge } from "tailwind-merge"
import { Icon } from "@/components/Icon"

export const NumberField: React.FC<
  ReactAria.NumberFieldProps & {
    size?: "sm" | "base"
  }
> = ({ size = "base", className, ...rest }) => (
  <ReactAria.NumberField
    {...rest}
    className={twMerge(
      "flex justify-between border border-grayscale-200 rounded-xs",
      size === "sm" ? "h-8 px-4" : "h-12 px-6",
      className as string
    )}
  >
    <ReactAria.Button
      slot="decrement"
      className="disabled:text-grayscale-200 transition-colors shrink-0"
    >
      <Icon
        name="minus"
        className={twJoin(size === "sm" ? "w-4 h-4" : "w-6 h-6")}
      />
    </ReactAria.Button>
    <ReactAria.Input
      className={twJoin(
        "disabled:text-grayscale-200 disabled:bg-transparent text-center focus-within:outline-none w-7 leading-none",
        size === "sm" ? "text-xs" : "text-sm"
      )}
    />
    <ReactAria.Button
      slot="increment"
      className="disabled:text-grayscale-200 transition-colors shrink-0"
    >
      <Icon
        name="plus"
        className={twJoin(size === "sm" ? "w-4 h-4" : "w-6 h-6")}
      />
    </ReactAria.Button>
  </ReactAria.NumberField>
)
