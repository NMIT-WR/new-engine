'use client'

import { Form, InputField } from '@/components/Forms'
import { LocalizedButtonLink } from '@/components/LocalizedLink'
import { forgotPassword } from '@lib/data/customer'
import { SubmitButton } from '@modules/common/components/submit-button'
import * as React from 'react'
import { z } from 'zod'

const forgotPasswordFormSchema = z.object({
  email: z.string().min(3).email(),
})

export const ForgotPasswordForm = () => {
  const [formState, formAction] = React.useActionState(forgotPassword, {
    state: 'initial',
  })

  const onSubmit = (values: z.infer<typeof forgotPasswordFormSchema>) => {
    React.startTransition(() => {
      formAction(values)
    })
  }

  if (formState.state === 'success') {
    return (
      <>
        <h1 className="mb-8 text-xl md:text-2xl">
          Your password is waiting for you!
        </h1>
        <div className="mb-8">
          <p>
            We&apos;ve sent you an email with further instructions on retrieving
            your account.
          </p>
        </div>
        <LocalizedButtonLink href="/" isFullWidth>
          Back to home page
        </LocalizedButtonLink>
      </>
    )
  }

  return (
    <Form onSubmit={onSubmit} schema={forgotPasswordFormSchema}>
      <h1 className="mb-8 text-xl md:text-2xl">Forgot password?</h1>
      <div className="mb-8">
        <p>
          Enter your email address below and we will send you instructions on
          how to reset your password.
        </p>
      </div>
      <InputField
        placeholder="Email"
        name="email"
        className="mb-8 flex-1"
        type="email"
      />
      {formState.state === 'error' && (
        <p className="text-red-primary text-sm">{formState.error}</p>
      )}
      <SubmitButton isFullWidth>Reset your password</SubmitButton>
    </Form>
  )
}
