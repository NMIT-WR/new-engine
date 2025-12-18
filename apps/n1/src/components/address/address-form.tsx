"use client"

import { useForm } from "@tanstack/react-form"
import { Button } from "@ui/atoms/button"
import { useCreateAddress, useUpdateAddress } from "@/hooks/use-addresses"
import { useToast } from "@/hooks/use-toast"
import { AddressValidationError } from "@/lib/errors"
import type { StoreCustomerAddress } from "@/services/customer-service"
import { addressToFormData, DEFAULT_ADDRESS } from "@/utils/address-helpers"
import type { AddressFormData } from "@/utils/address-validation"
import {
  cleanPhoneNumber,
  formatPhoneNumber,
} from "@/utils/format/format-phone-number"
import {
  cleanPostalCode,
  formatPostalCode,
} from "@/utils/format/format-postal-code"
import { AddressFormFields } from "./address-form-fields"

type AddressFormProps = {
  /** Existing address to edit (undefined for new address) */
  address?: StoreCustomerAddress
  /** Called when form is cancelled */
  onCancel: () => void
  /** Called after successful save */
  onSuccess: () => void
}

export function AddressForm({
  address,
  onCancel,
  onSuccess,
}: AddressFormProps) {
  const createAddress = useCreateAddress()
  const updateAddress = useUpdateAddress()
  const toaster = useToast()

  const isEditing = !!address
  const isPending = createAddress.isPending || updateAddress.isPending

  // Button text helper to avoid nested ternary
  const getSubmitButtonText = () => {
    if (isPending) {
      return "Ukládám..."
    }
    return isEditing ? "Uložit" : "Přidat"
  }

  // Initialize form with existing address or defaults
  const defaultValues: AddressFormData = {
    ...DEFAULT_ADDRESS,
    ...addressToFormData(address),
    // Format display values
    postal_code: formatPostalCode(address?.postal_code || ""),
    phone: formatPhoneNumber(address?.phone || ""),
  }
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      // Clean data before sending to API
      const cleanedData = {
        ...value,
        postal_code: cleanPostalCode(value.postal_code),
        phone: cleanPhoneNumber(value.phone || ""),
      }

      try {
        if (isEditing && address) {
          await updateAddress.mutateAsync({
            addressId: address.id,
            data: cleanedData,
          })
          toaster.create({ title: "Adresa upravena", type: "success" })
        } else {
          await createAddress.mutateAsync(cleanedData)
          toaster.create({ title: "Adresa přidána", type: "success" })
        }
        onSuccess()
      } catch (error) {
        // Handle validation errors from hooks
        if (AddressValidationError.isAddressValidationError(error)) {
          toaster.create({
            title: error.firstError,
            type: "error",
          })
        } else {
          toaster.create({
            title: isEditing ? "Chyba při úpravě" : "Chyba při přidání",
            type: "error",
          })
        }
      }
    },
  })

  return (
    <form
      className="space-y-400"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <AddressFormFields disabled={isPending} form={form} />

      <div className="flex justify-end gap-200 pt-200">
        <Button
          disabled={isPending}
          onClick={onCancel}
          size="sm"
          theme="borderless"
          type="button"
          variant="secondary"
        >
          Zrušit
        </Button>
        <Button disabled={isPending} size="sm" type="submit">
          {getSubmitButtonText()}
        </Button>
      </div>
    </form>
  )
}
