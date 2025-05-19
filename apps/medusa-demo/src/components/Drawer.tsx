import * as React from "react"
import { twMerge } from "tailwind-merge"
import * as ReactAria from "react-aria-components"
import { UiModal, UiModalOverlay, UiModalOwnProps } from "@/components/ui/Modal"
import { UiDialog } from "@/components/Dialog"

export interface DrawerProps
  extends Omit<ReactAria.ModalOverlayProps, "children">,
    UiModalOwnProps,
    Pick<ReactAria.DialogProps, "children"> {
  colorScheme?: "light" | "dark"
  className?: string
}

export const Drawer: React.FC<DrawerProps> = ({
  colorScheme = "dark",
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
          "flex justify-self-center overflow-y-scroll max-h-screen h-screen max-w-75 rounded-none",
          colorScheme === "light"
            ? "bg-white text-black"
            : "bg-black text-white",
          className
        )}
      >
        <UiDialog className="flex flex-col flex-1">{children}</UiDialog>
      </UiModal>
    </UiModalOverlay>
  )
}
