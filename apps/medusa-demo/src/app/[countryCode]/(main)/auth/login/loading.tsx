import Image from 'next/image'

import { Button } from '@/components/Button'
import { Input } from '@/components/Forms'
import { LocalizedLink } from '@/components/LocalizedLink'

export default async function LoginLoadingPage() {
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
        <h1 className="mb-10 text-xl md:mb-16 md:text-2xl">
          Welcome back to Sofa Society!
        </h1>
        <form className="mb-8 flex flex-col gap-6 md:mb-16 md:gap-8">
          <Input
            placeholder="Email"
            name="email"
            required
            wrapperClassName="flex-1"
            autoComplete="email"
            disabled
          />
          <Input
            placeholder="Password"
            name="password"
            type="password"
            required
            wrapperClassName="flex-1"
            autoComplete="current-password"
            disabled
          />
          <LocalizedLink
            href="/auth/forgot-password"
            variant="underline"
            className="!pb-0 self-start text-grayscale-500 leading-none"
          >
            Forgot password?
          </LocalizedLink>
          <Button isLoading>Log in</Button>
        </form>
        <p className="text-grayscale-500">
          Don&apos;t have an account yet? You can{' '}
          <LocalizedLink
            href="/auth/register"
            variant="underline"
            className="text-black md:pb-0.5"
          >
            register here
          </LocalizedLink>
          .
        </p>
      </div>
    </div>
  )
}
