'use client'

import * as ReactAria from 'react-aria-components'
import { twJoin, twMerge } from 'tailwind-merge'

export const UiModalOverlay: React.FC<ReactAria.ModalOverlayProps> = ({
  isDismissable = true,
  className,
  ...props
}) => (
  <ReactAria.ModalOverlay
    {...props}
    isDismissable={isDismissable}
    className={twMerge(
      'data-[entering]:fade-in data-[exiting]:fade-out fixed inset-0 z-50 flex min-h-full items-center justify-center bg-black-10% p-4 data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:duration-200 data-[exiting]:duration-100 data-[entering]:ease-out data-[exiting]:ease-in',
      className as string
    )}
  />
)

export type UiModalOwnProps = {
  animateFrom?: 'center' | 'right' | 'bottom' | 'left'
}

export const getModalClassNames = ({
  animateFrom = 'center',
}: UiModalOwnProps): string => {
  const animateFromClasses = {
    center: 'data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95',
    right:
      'data-[entering]:slide-in-from-right-10 data-[exiting]:slide-out-to-right-10 right-0 left-auto absolute',
    bottom:
      'data-[entering]:slide-in-from-bottom-10 data-[exiting]:slide-out-to-bottom-10 bottom-0 absolute',
    left: 'data-[entering]:slide-in-from-left-10 data-[exiting]:slide-out-to-left-10 left-0 right-auto absolute',
  }

  return twJoin(
    'max-h-full w-full max-w-154 overflow-y-scroll rounded-xs bg-white p-6 shadow-modal data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:duration-200 data-[exiting]:duration-100 data-[entering]:ease-out data-[exiting]:ease-in max-sm:px-4',
    animateFromClasses[animateFrom]
  )
}

export const UiModal: React.FC<
  UiModalOwnProps & ReactAria.ModalOverlayProps
> = ({ animateFrom = 'center', className, ...props }) => (
  <ReactAria.Modal
    {...props}
    className={twMerge(
      getModalClassNames({ animateFrom }),
      className as string
    )}
  />
)
