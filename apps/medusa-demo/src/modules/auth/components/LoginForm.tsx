'use client'
import { Form, InputField } from '@/components/Forms'
import { LocalizedLink } from '@/components/LocalizedLink'
import { withReactQueryProvider } from '@lib/util/react-query'
import type { emailFormSchema } from '@modules/checkout/components/email'
import { SubmitButton } from '@modules/common/components/submit-button'
import { useLogin } from 'hooks/customer'
import { useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const LoginForm = withReactQueryProvider<{
  className?: string
  redirectUrl?: string
  handleCheckout?: (values: z.infer<typeof emailFormSchema>) => void
}>(({ className, redirectUrl, handleCheckout }) => {
  const { isPending, data, mutate } = useLogin()

  const router = useRouter()

  const onSubmit = (values: z.infer<typeof loginFormSchema>) => {
    mutate(
      { ...values, redirect_url: redirectUrl },
      {
        onSuccess: (res) => {
          if (handleCheckout && res.success) {
            handleCheckout({ email: values.email })
          } else if (res.success) {
            router.push(res.redirectUrl || '/')
          }
        },
      }
    )
  }
  return (
    <Form onSubmit={onSubmit} schema={loginFormSchema}>
      <div className={twMerge('flex flex-col gap-6 md:gap-8', className)}>
        <InputField
          placeholder="Email"
          name="email"
          inputProps={{ autoComplete: 'email' }}
          className="flex-1"
        />
        <InputField
          placeholder="Password"
          name="password"
          type="password"
          className="flex-1"
          inputProps={{ autoComplete: 'current-password' }}
        />
        <LocalizedLink
          href="/auth/forgot-password"
          variant="underline"
          className="!pb-0 self-start text-grayscale-500 leading-none"
        >
          Forgot password?
        </LocalizedLink>
        {!data?.success && (
          <p className="text-red-primary text-sm">{data?.message}</p>
        )}
        <SubmitButton isLoading={isPending}>Log in</SubmitButton>
      </div>
    </Form>
  )
})
