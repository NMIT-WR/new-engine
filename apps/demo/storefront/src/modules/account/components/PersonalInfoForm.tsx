"use client"

import * as React from "react"
import * as ReactAria from "react-aria-components"
import { z } from "zod"

import { UiCloseButton } from "@/components/Dialog"
import { Form, InputField } from "@/components/Forms"
import { SubmitButton } from "@modules/common/components/submit-button"
import { updateCustomerFormSchema, useUpdateCustomer } from "hooks/customer"
import { withReactQueryProvider } from "@lib/util/react-query"

export const PersonalInfoForm = withReactQueryProvider<{
  defaultValues?: {
    first_name: string
    last_name: string
    phone?: string
  }
}>(({ defaultValues }) => {
  const { mutate, isPending, data } = useUpdateCustomer()

  const { close } = React.useContext(ReactAria.OverlayTriggerStateContext)!
  const onSubmit = (values: z.infer<typeof updateCustomerFormSchema>) => {
    mutate(values, {
      onSuccess: (res) => {
        if (res.state === "success") {
          close()
        }
      },
    })
  }
  return (
    <Form
      onSubmit={onSubmit}
      schema={updateCustomerFormSchema}
      defaultValues={defaultValues}
    >
      {({ watch }) => {
        const formData = watch()
        const isDisabled =
          !Object.values(formData).some((value) => value) ||
          (defaultValues
            ? !Object.entries(formData).some(
                ([key, value]) =>
                  defaultValues[key as keyof typeof defaultValues] !== value
              )
            : false)
        return (
          <>
            <p className="text-md mb-8 sm:mb-10">Personal information</p>
            <div className="flex flex-col gap-4 sm:gap-8">
              <div className="flex max-xs:flex-col gap-y-4 gap-x-6">
                <InputField
                  placeholder="First name"
                  name="first_name"
                  className=" flex-1"
                  inputProps={{ autoComplete: "given-name" }}
                />
                <InputField
                  placeholder="Last name"
                  name="last_name"
                  className="flex-1"
                  inputProps={{ autoComplete: "family-name" }}
                />
              </div>
              <InputField
                placeholder="Phone"
                name="phone"
                className="flex-1 mb-8 sm:mb-10"
                type="tel"
                inputProps={{ autoComplete: "tel" }}
              />
              {data?.state === "error" && (
                <div className="text-sm text-red-primary">{data?.error}</div>
              )}
            </div>
            <div className="flex gap-6 justify-between">
              <SubmitButton isLoading={isPending} isDisabled={isDisabled}>
                Save changes
              </SubmitButton>
              <UiCloseButton variant="outline">Cancel</UiCloseButton>
            </div>
          </>
        )
      }}
    </Form>
  )
})
