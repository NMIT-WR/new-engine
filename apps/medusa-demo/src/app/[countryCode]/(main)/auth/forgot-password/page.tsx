import { ForgotPasswordForm } from '@modules/auth/components/ForgotPasswordForm'
import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Forgot password',
  description: 'Reset your password',
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen">
      <Image
        src="/images/content/gray-backrest-sofa-wooden-coffee-table.png"
        width={1440}
        height={1632}
        alt="Gray backrest sofa and wooden coffee table"
        className="shrink-0 object-cover max-lg:hidden lg:w-1/2"
      />
      <div className="mx-auto w-full max-w-100 shrink-0 pt-30 pb-16 max-sm:px-4 lg:max-w-96 lg:pt-37">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
