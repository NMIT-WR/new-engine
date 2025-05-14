"use client"

import * as React from "react"
import * as ReactAria from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { Button, ButtonProps } from "@/components/Button"
import { OverlayTriggerState } from "react-stately"

export function UiDialogTrigger({
  children,
  ...rest
}: ReactAria.DialogTriggerProps) {
  return <ReactAria.DialogTrigger {...rest}>{children}</ReactAria.DialogTrigger>
}

export function UiDialog({
  children,
  className,
  ...rest
}: ReactAria.DialogProps) {
  return (
    <ReactAria.Dialog
      {...rest}
      className={twMerge("focus-visible:outline-none", className)}
    >
      {children}
    </ReactAria.Dialog>
  )
}

export function UiCloseButton(props: ButtonProps) {
  const { close } = React.useContext(
    ReactAria.OverlayTriggerStateContext as unknown as React.Context<OverlayTriggerState | null>
  )!
  return <Button {...props} onPress={close} />
}

export function UiConfirmButton(
  props: ButtonProps & { onConfirm: () => Promise<void> }
) {
  const { close } = React.useContext(
    ReactAria.OverlayTriggerStateContext as unknown as React.Context<OverlayTriggerState | null>
  )!
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
