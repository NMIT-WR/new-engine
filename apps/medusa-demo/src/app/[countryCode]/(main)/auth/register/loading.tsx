import { Input } from '@/components/Forms'
import { LocalizedLink } from '@/components/LocalizedLink'
import { SubmitButton } from '@modules/common/components/submit-button'
import Image from 'next/image'

export default function RegisterLoadingPage() {
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
        <form className="mb-8 flex flex-col gap-6 md:mb-16 md:gap-8">
          <div className="flex gap-4 md:gap-6">
            <Input
              placeholder="First name"
              name="first_name"
              required
              wrapperClassName="flex-1"
              minLength={1}
              disabled
            />
            <Input
              placeholder="Last name"
              name="last_name"
              required
              wrapperClassName="flex-1"
              minLength={1}
              disabled
            />
          </div>
          <Input
            placeholder="Email"
            name="email"
            required
            wrapperClassName="flex-1"
            type="email"
            disabled
          />
          <Input
            placeholder="Phone"
            name="phone"
            wrapperClassName="flex-1"
            type="tel"
            disabled
          />
          <Input
            placeholder="Password"
            name="password"
            type="password"
            required
            wrapperClassName="flex-1"
            autoComplete="new-password"
            minLength={6}
            disabled
          />
          <Input
            placeholder="Confirm password"
            name="confirm_password"
            type="password"
            required
            wrapperClassName="flex-1"
            autoComplete="new-password"
            minLength={6}
            disabled
          />
          <SubmitButton isLoading>Register</SubmitButton>
        </form>
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
