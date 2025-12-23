"use client"

import { useForm } from "@tanstack/react-form"
import { Button } from "@ui/atoms/button"
import { Dialog } from "@ui/molecules/dialog"
import { useEffect } from "react"
import { SelectField } from "@/components/forms/fields/select-field"
import { TextField } from "@/components/forms/fields/text-field"
import { COUNTRY_OPTIONS } from "@/lib/constants"
import { addressValidators } from "@/lib/form-validators"
import { addressToFormData } from "@/utils/address-helpers"
import type { AddressFormData } from "@/utils/address-validation"
import { formatPhoneNumber } from "@/utils/format/format-phone-number"
import { formatPostalCode } from "@/utils/format/format-postal-code"
import type { HttpTypes } from "@medusajs/types"

type AddressFormDialogProps = {
  open: boolean
  onOpenChange: (details: { open: boolean }) => void
  initialData?: Partial<HttpTypes.StoreCartAddress>
  onSubmit: (data: AddressFormData) => Promise<void>
  isSubmitting?: boolean
  mode?: "add" | "edit"
}

export function AddressFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting = false,
  mode = "add",
}: AddressFormDialogProps) {
  const form = useForm({
    defaultValues: addressToFormData(initialData),
    onSubmit: async ({ value }) => {
      await onSubmit(value)
      onOpenChange({ open: false })
    },
  })

  // Reset form when dialog opens with new initial data
  useEffect(() => {
    if (open) {
      form.reset(addressToFormData(initialData))
    }
  }, [open, initialData, form])

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      customTrigger
      title={mode === "edit" ? "Edit Shipping Address" : "Add Shipping Address"}
      description="Please provide your shipping details for order delivery."
      placement="center"
      size="md"
      modal
      closeOnEscape={!isSubmitting}
      closeOnInteractOutside={!isSubmitting}
      actions={
        <>
          <Button
            variant="secondary"
            onClick={() => onOpenChange({ open: false })}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => form.handleSubmit()}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : mode === "edit" ? "Update Address" : "Add Address"}
          </Button>
        </>
      }
    >
      <form
        className="flex flex-col gap-400"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        {/* Name fields */}
        <div className="grid grid-cols-2 gap-300">
          <form.Field
            name="first_name"
            validators={addressValidators.first_name}
          >
            {(field) => (
              <TextField
                field={field}
                label="First Name"
                placeholder="John"
                required
                disabled={isSubmitting}
              />
            )}
          </form.Field>

          <form.Field name="last_name" validators={addressValidators.last_name}>
            {(field) => (
              <TextField
                field={field}
                label="Last Name"
                placeholder="Doe"
                required
                disabled={isSubmitting}
              />
            )}
          </form.Field>
        </div>

        {/* Address fields */}
        <form.Field name="address_1" validators={addressValidators.address_1}>
          {(field) => (
            <TextField
              field={field}
              label="Address Line 1"
              placeholder="Street address"
              required
              disabled={isSubmitting}
            />
          )}
        </form.Field>

        <form.Field name="address_2" validators={addressValidators.address_2}>
          {(field) => (
            <TextField
              field={field}
              label="Address Line 2"
              placeholder="Apartment, suite, etc. (optional)"
              disabled={isSubmitting}
            />
          )}
        </form.Field>

        {/* City and Postal Code */}
        <div className="grid grid-cols-2 gap-300">
          <form.Field name="city" validators={addressValidators.city}>
            {(field) => (
              <TextField
                field={field}
                label="City"
                placeholder="Prague"
                required
                disabled={isSubmitting}
              />
            )}
          </form.Field>

          <form.Field
            name="postal_code"
            validators={addressValidators.postal_code}
          >
            {(field) => (
              <TextField
                field={field}
                label="Postal Code"
                placeholder="110 00"
                required
                disabled={isSubmitting}
                transform={formatPostalCode}
              />
            )}
          </form.Field>
        </div>

        {/* Country and Phone */}
        <div className="grid grid-cols-2 gap-300">
          <form.Field
            name="country_code"
            validators={addressValidators.country_code}
          >
            {(field) => (
              <SelectField
                field={field}
                label="Country"
                options={COUNTRY_OPTIONS}
                required
                disabled={isSubmitting}
              />
            )}
          </form.Field>

          <form.Field name="phone" validators={addressValidators.phone}>
            {(field) => (
              <TextField
                field={field}
                label="Phone"
                placeholder="+420 123 456 789"
                type="tel"
                disabled={isSubmitting}
                transform={formatPhoneNumber}
              />
            )}
          </form.Field>
        </div>
      </form>
    </Dialog>
  )
}
