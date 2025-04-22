"use client"

import * as React from "react"
import { redirect } from "next/navigation"

import { resetPassword } from "@lib/data/customer"
import { SubmitButton } from "@modules/common/components/submit-button"
import { Form, InputField } from "@/components/Forms"
import { z } from "zod"
import { UiModal, UiModalOverlay } from "@/components/ui/Modal"
import { UiCloseButton, UiDialog } from "@/components/Dialog"
import { Icon } from "@/components/Icon"

const resetPasswordSchema = z.object({
  type: z.literal("reset"),
  current_password: z.string().min(6),
  new_password: z.string().min(6),
  confirm_new_password: z.string().min(6),
})

const forgotPasswordSchema = z.object({
  type: z.literal("forgot"),
  new_password: z.string().min(6),
  confirm_new_password: z.string().min(6),
})

const baseSchema = z.discriminatedUnion("type", [
  resetPasswordSchema,
  forgotPasswordSchema,
])

const resetPasswordFormSchema = baseSchema.superRefine((data, ctx) => {
  if (data.new_password !== data.confirm_new_password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords must match",
      path: ["confirm_new_password"],
    })
  }

  if (data.type === "reset" && data.current_password === data.new_password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "New password must be different from the current password",
      path: ["new_password"],
    })
  }
})

export const ChangePasswordForm: React.FC<{
  email: string
  token: string
  customer?: boolean
}> = ({ email, token, customer }) => {
  const [formState, formAction, isPending] = React.useActionState(
    resetPassword,
    { email, token, state: "initial" }
  )

  const [isModalOpen, setIsModalOpen] = React.useState(false)

  React.useEffect(() => {
    if (formState.state === "success") {
      setIsModalOpen(true)
    }
  }, [formState])

  const onSubmit = (values: z.infer<typeof resetPasswordFormSchema>) => {
    React.startTransition(() => formAction(values))
  }

  return (
    <>
      <Form
        onSubmit={onSubmit}
        schema={resetPasswordFormSchema}
        defaultValues={customer ? { type: "reset" } : { type: "forgot" }}
      >
        <h1 className="text-lg mb-6 md:mb-8">Reset password</h1>
        <div className="flex flex-col gap-4 mb-6 md:mb-8">
          {customer && (
            <InputField
              type="password"
              placeholder="Current password"
              name="current_password"
              inputProps={{ autoComplete: "current-password" }}
            />
          )}
          <InputField
            type="password"
            placeholder="New password"
            name="new_password"
            inputProps={{ autoComplete: "new-password" }}
          />
          <InputField
            type="password"
            placeholder="Confirm new password"
            name="confirm_new_password"
            inputProps={{ autoComplete: "new-password" }}
          />
        </div>
        {formState.state === "error" && (
          <p className="text-red-primary text-sm mb-6">{formState.error}</p>
        )}
        <SubmitButton isLoading={isPending} isFullWidth>
          Reset password
        </SubmitButton>
      </Form>
      <UiModalOverlay
        isOpen={isModalOpen}
        isDismissable={false}
        onOpenChange={(isOpen) => !isOpen && redirect("/auth/login")}
        className="bg-transparent"
      >
        <UiModal className="relative">
          <UiDialog>
            <p className="text-md mb-12">Password reset successful!</p>
            <p className="text-grayscale-500">
              Your password has been successfully reset. You may now use your
              new password to log in.
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
    </>
  )
}
