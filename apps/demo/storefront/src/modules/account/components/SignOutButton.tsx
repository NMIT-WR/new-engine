"use client"

import * as React from "react"
import { SubmitButton } from "@modules/common/components/submit-button"
import { useCountryCode } from "hooks/country-code"
import { ButtonProps } from "@/components/Button"
import { useSignout } from "hooks/customer"
import { withReactQueryProvider } from "@lib/util/react-query"

export const SignOutButton = withReactQueryProvider<Omit<ButtonProps, "type">>(
  (rest) => {
    const countryCode = useCountryCode()
    const { mutateAsync, isPending } = useSignout()

    const handleSignout = async () => {
      if (countryCode) {
        await mutateAsync(countryCode ?? "")
      }
    }

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSignout()
        }}
      >
        <SubmitButton {...rest} isLoading={isPending}>
          Log out
        </SubmitButton>
      </form>
    )
  }
)
