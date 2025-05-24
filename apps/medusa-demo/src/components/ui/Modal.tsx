"use client"

import * as ReactAria from "react-aria-components"
import { twJoin, twMerge } from "tailwind-merge"

export const UiModalOverlay: React.FC<ReactAria.ModalOverlayProps> = ({
  isDismissable = true,
  className,
  ...props
}) => (
  <ReactAria.ModalOverlay
    {...props}
    isDismissable={isDismissable}
    className={twMerge(
      "fixed inset-0 flex min-h-full items-center justify-center bg-black-10% z-50 data-[entering]:animate-in data-[entering]:fade-in data-[entering]:duration-200 data-[entering]:ease-out data-[exiting]:animate-out data-[exiting]:fade-out data-[exiting]:duration-100 data-[exiting]:ease-in p-4",
      className as string
    )}
  />
)

export type UiModalOwnProps = {
  animateFrom?: "center" | "right" | "bottom" | "left"
}

export const getModalClassNames = ({
  animateFrom = "center",
}: UiModalOwnProps): string => {
  const animateFromClasses = {
    center: "data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95",
    right:
      "data-[entering]:slide-in-from-right-10 data-[exiting]:slide-out-to-right-10 right-0 left-auto absolute",
    bottom:
      "data-[entering]:slide-in-from-bottom-10 data-[exiting]:slide-out-to-bottom-10 bottom-0 absolute",
    left: "data-[entering]:slide-in-from-left-10 data-[exiting]:slide-out-to-left-10 left-0 right-auto absolute",
  }

  return twJoin(
    "bg-white max-sm:px-4 p-6 rounded-xs max-h-full overflow-y-scroll max-w-154 w-full shadow-modal data-[entering]:animate-in data-[entering]:ease-out data-[entering]:duration-200 data-[exiting]:animate-out data-[exiting]:ease-in data-[exiting]:duration-100",
    animateFromClasses[animateFrom]
  )
}

export const UiModal: React.FC<
  UiModalOwnProps & ReactAria.ModalOverlayProps
> = ({ animateFrom = "center", className, ...props }) => (
  <ReactAria.Modal
    {...props}
    className={twMerge(
      getModalClassNames({ animateFrom }),
      className as string
    )}
  />
)
