"use client"

import * as React from "react"
import * as ReactAria from "react-aria-components"
import { CountrySelectProps } from "@modules/checkout/components/country-select"
import { CountrySelectField, Form, InputField } from "@/components/Forms"
import { UiCloseButton } from "@/components/Dialog"
import { z } from "zod"
import { SubmitButton } from "@modules/common/components/submit-button"
import { customerAddressSchema, useAddressMutation } from "hooks/customer"
import { withReactQueryProvider } from "@lib/util/react-query"

export const UpsertAddressForm = withReactQueryProvider<{
  addressId?: string
  region?: CountrySelectProps["region"]
  defaultValues?: {
    first_name?: string
    last_name?: string
    company?: string
    address_1?: string
    address_2?: string
    city?: string
    postal_code?: string
    province?: string
    country_code?: string
    phone?: string
  }
}>(({ addressId, region, defaultValues }) => {
  const { close } = React.useContext(ReactAria.OverlayTriggerStateContext)!
  const { mutate, isPending, data } = useAddressMutation(addressId)

  const onSubmit = (values: z.infer<typeof customerAddressSchema>) => {
    mutate(values, {
      onSuccess: (res) => {
        if (res.success) {
          close()
        }
      },
    })
  }

  return (
    <Form
      onSubmit={onSubmit}
      schema={customerAddressSchema}
      defaultValues={{
        first_name: defaultValues?.first_name,
        last_name: defaultValues?.last_name,
        company: defaultValues?.company,
        address_1: defaultValues?.address_1,
        address_2: defaultValues?.address_2,
        phone: defaultValues?.phone,
        city: defaultValues?.city,
        postal_code: defaultValues?.postal_code,
        country_code: defaultValues?.country_code,
        province: defaultValues?.province,
      }}
    >
      {({ setValue, watch }) => {
        const watchedValues = watch()
        const isDisabled =
          !Object.values(watchedValues).some((value) => value) ||
          (defaultValues
            ? !Object.entries(watchedValues).some(
                ([key, value]) =>
                  defaultValues[key as keyof typeof defaultValues] !== value
              )
            : false)
        return (
          <>
            <p className="text-md mb-8 md:mb-10">
              {addressId ? "Change address" : "Add another address"}
            </p>
            <div className="flex flex-col gap-4 md:gap-8 mb-8 md:mb-10">
              <div className="flex max-xs:flex-col gap-4 md:gap-6">
                <InputField
                  placeholder="First name"
                  name="first_name"
                  className=" flex-1"
                  inputProps={{
                    autoComplete: "given-name",
                  }}
                />
                <InputField
                  placeholder="Last name"
                  name="last_name"
                  className=" flex-1"
                  inputProps={{
                    autoComplete: "family-name",
                  }}
                />
              </div>
              <InputField
                placeholder="Company (Optional)"
                name="company"
                className=" flex-1"
                inputProps={{
                  autoComplete: "organization",
                }}
              />
              <InputField
                placeholder="Address"
                name="address_1"
                inputProps={{
                  autoComplete: "address-line1",
                }}
              />
              <InputField
                placeholder="Apartment, suite, etc. (Optional)"
                name="address_2"
                inputProps={{
                  autoComplete: "address-line2",
                }}
              />
              <InputField
                placeholder="Phone (Optional)"
                name="phone"
                type="tel"
                inputProps={{
                  autoComplete: "tel",
                }}
              />
              <div className="flex max-xs:flex-col gap-4 md:gap-6">
                <InputField
                  placeholder="Postal code"
                  name="postal_code"
                  className=" flex-1"
                  inputProps={{
                    autoComplete: "postal-code",
                  }}
                />
                <InputField
                  placeholder="City"
                  name="city"
                  className=" flex-1"
                  inputProps={{ autoComplete: "address-level2" }}
                />
              </div>
              <div className="flex max-xs:flex-col gap-4 md:gap-6">
                <InputField
                  placeholder="Province (Optional)"
                  name="province"
                  className=" flex-1"
                  inputProps={{ autoComplete: "address-level1" }}
                />
                <CountrySelectField
                  selectProps={{
                    region: region ?? undefined,
                    defaultSelectedKey: defaultValues?.country_code,
                    autoComplete: "country",
                    onSelectionChange: (value) =>
                      setValue("country_code", `${value}`),
                  }}
                  name="country_code"
                  className="flex-1"
                />
              </div>
              {!data?.success && (
                <p className="text-red-primary">{data?.error}</p>
              )}
            </div>
            <div className="flex gap-6 justify-between">
              <SubmitButton isLoading={isPending} isDisabled={isDisabled}>
                {addressId ? "Save changes" : "Add address"}
              </SubmitButton>
              <UiCloseButton variant="outline">Cancel</UiCloseButton>
            </div>
          </>
        )
      }}
    </Form>
  )
})
