"use client"

import * as React from "react"

import { Button } from "@/components/Button"
import { UiCloseButton, UiDialog, UiDialogTrigger } from "@/components/Dialog"
import { Icon } from "@/components/Icon"
import { UiModal, UiModalOverlay } from "@/components/ui/Modal"
import { requestPasswordReset } from "@lib/data/customer"

export const RequestPasswordResetButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  return (
    <>
      {errorMessage && (
        <div className="text-sm text-red-primary">{errorMessage}</div>
      )}
      <UiDialogTrigger
        isOpen={isModalOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setIsModalOpen(false)
          }
        }}
      >
        <Button
          isLoading={isLoading}
          onPress={async () => {
            setIsLoading(true)
            const result = await requestPasswordReset().catch((error) => {
              console.error(error)

              return { success: false, error: "Something went wrong" }
            })

            if (result.success) {
              setIsModalOpen(true)
            } else {
              setErrorMessage(result.error)
            }

            setIsLoading(false)
          }}
          className="max-sm:w-full"
        >
          Reset password
        </Button>
        <UiModalOverlay isDismissable={false} className="bg-transparent">
          <UiModal className="relative">
            <UiDialog>
              <p className="text-md mb-12">Reset password</p>
              <p className="text-grayscale-500">
                We have sent an email with instructions on how to change the
                password.
              </p>
              <UiCloseButton
                variant="ghost"
                className="absolute top-4 right-6 p-0"
              >
                <Icon name="close" className="w-6 h-6" />
              </UiCloseButton>
            </UiDialog>
          </UiModal>
        </UiModalOverlay>
      </UiDialogTrigger>
    </>
  )
}
