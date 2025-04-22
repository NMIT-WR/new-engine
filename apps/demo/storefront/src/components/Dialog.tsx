"use client"

import * as React from "react"
import * as ReactAria from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { Button, ButtonProps } from "@/components/Button"

export const UiDialogTrigger: React.FC<ReactAria.DialogTriggerProps> = ({
  children,
  ...rest
}) => <ReactAria.DialogTrigger {...rest}>{children}</ReactAria.DialogTrigger>

export const UiDialog: React.FC<ReactAria.DialogProps> = ({
  children,
  className,
  ...rest
}) => (
  <ReactAria.Dialog
    {...rest}
    className={twMerge("focus-visible:outline-none", className)}
  >
    {children}
  </ReactAria.Dialog>
)

export const UiCloseButton: React.FC<ButtonProps> = (props) => {
  const { close } = React.useContext(ReactAria.OverlayTriggerStateContext)!

  return <Button {...props} onPress={close} />
}

export const UiConfirmButton: React.FC<
  ButtonProps & { onConfirm: () => Promise<void> }
> = (props) => {
  const { close } = React.useContext(ReactAria.OverlayTriggerStateContext)!
  const onPress = React.useCallback(
    async (e: ReactAria.PressEvent) => {
      await props.onConfirm()
      close()
      props.onPress?.(e)
    },
    [props, close]
  )

  return <Button {...props} onPress={onPress} />
}
