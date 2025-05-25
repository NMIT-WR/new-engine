import type { Metadata } from 'next'
import Image from 'next/image'
import { redirect } from 'next/navigation'

import { LocalizedLink } from '@/components/LocalizedLink'
import { getCustomer } from '@lib/data/customer'
import { SignUpForm } from '@modules/auth/components/SignUpForm'

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create an account',
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const customer = await getCustomer().catch(() => null)

  if (customer) {
    redirect(`/${(await params).countryCode}/account`)
  }

  return (
    <div className="flex min-h-screen">
      <Image
        src="/images/content/living-room-dark-gray-corner-sofa-coffee-table.png"
        width={1440}
        height={1632}
        alt="Living room with dark gray corner sofa and coffee table"
        className="shrink-0 object-cover max-lg:hidden lg:w-1/2"
      />
      <div className="mx-auto w-full max-w-100 shrink-0 pt-30 pb-16 max-sm:px-4 lg:max-w-96 lg:pt-37">
        <h1 className="mb-10 text-xl md:mb-16 md:text-2xl">
          Hey, welcome to Sofa Society!
        </h1>
        <SignUpForm />
        <p className="text-grayscale-500">
          Already have an account? No worries, just{' '}
          <LocalizedLink
            href="/auth/login"
            variant="underline"
            className="text-black md:pb-0.5"
          >
            log in
          </LocalizedLink>
          .
        </p>
      </div>
    </div>
  )
}
