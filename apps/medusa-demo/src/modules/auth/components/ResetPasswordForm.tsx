'use client'

import { redirect } from 'next/navigation'
import * as React from 'react'

import { UiCloseButton, UiDialog } from '@/components/Dialog'
import { Form, InputField } from '@/components/Forms'
import { Icon } from '@/components/Icon'
import { UiModal, UiModalOverlay } from '@/components/ui/Modal'
import { resetPassword } from '@lib/data/customer'
import { SubmitButton } from '@modules/common/components/submit-button'
import { z } from 'zod'

const resetPasswordSchema = z.object({
  type: z.literal('reset'),
  current_password: z.string().min(6),
  new_password: z.string().min(6),
  confirm_new_password: z.string().min(6),
})

const forgotPasswordSchema = z.object({
  type: z.literal('forgot'),
  new_password: z.string().min(6),
  confirm_new_password: z.string().min(6),
})

const baseSchema = z.discriminatedUnion('type', [
  resetPasswordSchema,
  forgotPasswordSchema,
])

const resetPasswordFormSchema = baseSchema.superRefine((data, ctx) => {
  if (data.new_password !== data.confirm_new_password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passwords must match',
      path: ['confirm_new_password'],
    })
  }

  if (data.type === 'reset' && data.current_password === data.new_password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'New password must be different from the current password',
      path: ['new_password'],
    })
  }
})

type ChangePasswordFormType = {
  email: string
  token: string
  customer?: boolean
}

export const ChangePasswordForm = ({
  email,
  token,
  customer,
}: ChangePasswordFormType) => {
  const [formState, formAction, isPending] = React.useActionState(
    resetPassword,
    { email, token, state: 'initial' }
  )

  const [isModalOpen, setIsModalOpen] = React.useState(false)

  React.useEffect(() => {
    if (formState.state === 'success') {
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
        defaultValues={customer ? { type: 'reset' } : { type: 'forgot' }}
      >
        <h1 className="mb-6 text-lg md:mb-8">Reset password</h1>
        <div className="mb-6 flex flex-col gap-4 md:mb-8">
          {customer && (
            <InputField
              type="password"
              placeholder="Current password"
              name="current_password"
              inputProps={{ autoComplete: 'current-password' }}
            />
          )}
          <InputField
            type="password"
            placeholder="New password"
            name="new_password"
            inputProps={{ autoComplete: 'new-password' }}
          />
          <InputField
            type="password"
            placeholder="Confirm new password"
            name="confirm_new_password"
            inputProps={{ autoComplete: 'new-password' }}
          />
        </div>
        {formState.state === 'error' && (
          <p className="mb-6 text-red-primary text-sm">{formState.error}</p>
        )}
        <SubmitButton isLoading={isPending} isFullWidth>
          Reset password
        </SubmitButton>
      </Form>
      <UiModalOverlay
        isOpen={isModalOpen}
        isDismissable={false}
        onOpenChange={(isOpen) => !isOpen && redirect('/auth/login')}
        className="bg-transparent"
      >
        <UiModal className="relative">
          <UiDialog>
            <p className="mb-12 text-md">Password reset successful!</p>
            <p className="text-grayscale-500">
              Your password has been successfully reset. You may now use your
              new password to log in.
            </p>
            <UiCloseButton
              variant="ghost"
              className="absolute top-4 right-6 p-0"
            >
              <Icon name="close" className="h-6 w-6" />
            </UiCloseButton>
          </UiDialog>
        </UiModal>
      </UiModalOverlay>
    </>
  )
}
