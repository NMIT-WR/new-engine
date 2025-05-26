import { UiDialog } from '@/components/Dialog'
import {
  UiModal,
  UiModalOverlay,
  type UiModalOwnProps,
} from '@/components/ui/Modal'
import type * as React from 'react'
import type * as ReactAria from 'react-aria-components'
import { twMerge } from 'tailwind-merge'

export interface DrawerProps
  extends Omit<ReactAria.ModalOverlayProps, 'children'>,
    UiModalOwnProps,
    Pick<ReactAria.DialogProps, 'children'> {
  colorScheme?: 'light' | 'dark'
  className?: string
}

export const Drawer: React.FC<DrawerProps> = ({
  colorScheme = 'dark',
  animateFrom,
  className,
  children,
  ...rest
}) => {
  return (
    <UiModalOverlay {...rest}>
      <UiModal
        animateFrom={animateFrom}
        className={twMerge(
          'flex h-screen max-h-screen max-w-75 justify-self-center overflow-y-scroll rounded-none',
          colorScheme === 'light'
            ? 'bg-white text-black'
            : 'bg-black text-white',
          className
        )}
      >
        <UiDialog className="flex flex-1 flex-col">{children}</UiDialog>
      </UiModal>
    </UiModalOverlay>
  )
}
