import * as React from "react"
import { twJoin, twMerge } from "tailwind-merge"

export const Layout = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<"div">
>(({ className, ...rest }, ref) => (
  <div
    {...rest}
    ref={ref}
    className={twMerge(
      "mx-auto grid grid-cols-12 gap-x-4 md:gap-x-12 px-4 sm:container",
      className
    )}
  />
))

Layout.displayName = "Layout"

// const fullConfig = resolveConfig(tailwindConfig);
// const breakpointsNamesArray = Object.keys(fullConfig.theme.screens);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const breakpointsNamesArray = ["base", "xs", "sm", "md", "lg", "xl"] as const

type BreakpointsNames = (typeof breakpointsNamesArray)[number]
type ColumnsNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13
type LayoutOwnProps = {
  start?: { [key in BreakpointsNames]?: ColumnsNumbers } | ColumnsNumbers
  end?: { [key in BreakpointsNames]?: ColumnsNumbers } | ColumnsNumbers
}

export const getLayoutColumnClasses = ({
  start = 1,
  end = 13,
}: Pick<LayoutOwnProps, "start" | "end">): string => {
  const startClasses =
    typeof start === "number"
      ? [`col-start-${start}`]
      : Object.entries(start).map(([breakpoint, columns]) => {
          if (breakpoint === "base") {
            return `col-start-${columns}`
          }
          return `${breakpoint}:col-start-${columns}`
        })

  const endClasses =
    typeof end === "number"
      ? [`col-end-${end}`]
      : Object.entries(end).map(([breakpoint, columns]) => {
          if (breakpoint === "base") {
            return `col-end-${columns}`
          }
          return `${breakpoint}:col-end-${columns}`
        })

  return twJoin(...startClasses, ...endClasses)
}

export const LayoutColumn: React.FC<
  React.ComponentPropsWithRef<"div"> & LayoutOwnProps
> = ({ start = 1, end = 13, className, ...rest }) => {
  return (
    <div
      {...rest}
      className={twMerge(getLayoutColumnClasses({ start, end }), className)}
    />
  )
}
