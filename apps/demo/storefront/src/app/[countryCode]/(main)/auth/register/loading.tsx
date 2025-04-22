import Image from "next/image"
import { LocalizedLink } from "@/components/LocalizedLink"
import { Input } from "@/components/Forms"
import { SubmitButton } from "@modules/common/components/submit-button"

export default function RegisterLoadingPage() {
  return (
    <div className="flex min-h-screen">
      <Image
        src="/images/content/living-room-dark-gray-corner-sofa-coffee-table.png"
        width={1440}
        height={1632}
        alt="Living room with dark gray corner sofa and coffee table"
        className="max-lg:hidden lg:w-1/2 shrink-0 object-cover"
      />
      <div className="shrink-0 max-w-100 lg:max-w-96 w-full mx-auto pt-30 lg:pt-37 pb-16 max-sm:px-4">
        <h1 className="text-xl md:text-2xl mb-10 md:mb-16">
          Hey, welcome to Sofa Society!
        </h1>
        <form className="flex flex-col gap-6 md:gap-8 mb-8 md:mb-16">
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
          Already have an account? No worries, just{" "}
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
