"use client"

import type { HttpTypes } from "@medusajs/types"
import { Button } from "@ui/atoms/button"
import { Dialog } from "@ui/molecules/dialog"
import { FormInput } from "@ui/molecules/form-input"
import { Select } from "@ui/molecules/select"
import { useEffect, useState } from "react"
import { COUNTRY_OPTIONS } from "@/lib/constants"
import type {
  AddressErrors,
  AddressFieldKey,
  AddressFormData,
  AddressTouched,
} from "@/utils/address-validation"
import {
  validateAddressField,
  validateAddressForm,
} from "@/utils/address-validation"
import { formatPostalCode } from "@/utils/format/format-postal-code"

interface AddressFormDialogProps {
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
  const [formData, setFormData] = useState<AddressFormData>({
    first_name: "",
    last_name: "",
    address_1: "",
    address_2: "",
    city: "",
    postal_code: "",
    country_code: "cz",
    phone: "",
  })

  const [errors, setErrors] = useState<AddressErrors>({})
  const [touched, setTouched] = useState<AddressTouched>({})

  // Initialize form with existing data
  useEffect(() => {
    if (initialData) {
      setFormData({
        first_name: initialData.first_name || "",
        last_name: initialData.last_name || "",
        address_1: initialData.address_1 || "",
        address_2: initialData.address_2 || "",
        city: initialData.city || "",
        postal_code: initialData.postal_code || "",
        country_code: initialData.country_code || "cz",
        phone: initialData.phone || "",
      })
    }
  }, [initialData])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setErrors({})
      setTouched({})
    }
  }, [open])

  const handleFieldChange = (field: AddressFieldKey, value: string) => {
    // Auto-format postal code using centralized function
    if (field === "postal_code") {
      value = formatPostalCode(value)
    }

    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing - use centralized validation
    if (touched[field]) {
      const error = validateAddressField(field, value, formData.country_code)
      setErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

  const handleFieldBlur = (field: AddressFieldKey) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const fieldValue = formData[field] || ""
    const error = validateAddressField(field, fieldValue, formData.country_code)
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const handleValidateForm = (): boolean => {
    // Use centralized validation
    const newErrors = validateAddressForm(formData)

    setErrors(newErrors)
    setTouched(
      Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    )

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!handleValidateForm()) {
      return
    }

    try {
      await onSubmit(formData)
      onOpenChange({ open: false })
    } catch (_error) {}
  }

  return (
    <Dialog
      actions={
        <>
          <Button
            disabled={isSubmitting}
            onClick={() => onOpenChange({ open: false })}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            disabled={isSubmitting}
            onClick={handleSubmit}
            variant="primary"
          >
            {isSubmitting
              ? "Saving..."
              : mode === "edit"
                ? "Update Address"
                : "Add Address"}
          </Button>
        </>
      }
      closeOnEscape={!isSubmitting}
      closeOnInteractOutside={!isSubmitting}
      customTrigger
      description="Please provide your shipping details for order delivery."
      modal
      onOpenChange={onOpenChange}
      open={open}
      placement="center"
      size="md"
      title={mode === "edit" ? "Edit Shipping Address" : "Add Shipping Address"}
    >
      <div className="flex flex-col gap-400">
        {/* Name fields */}
        <div className="grid grid-cols-2 gap-300">
          <FormInput
            helpText={errors.first_name}
            id="first_name"
            label="First Name"
            onBlur={() => handleFieldBlur("first_name")}
            onChange={(e) => handleFieldChange("first_name", e.target.value)}
            placeholder="John"
            required
            validateStatus={errors.first_name ? "error" : "default"}
            value={formData.first_name}
          />
          <FormInput
            helpText={errors.last_name}
            id="last_name"
            label="Last Name"
            onBlur={() => handleFieldBlur("last_name")}
            onChange={(e) => handleFieldChange("last_name", e.target.value)}
            placeholder="Doe"
            required
            validateStatus={errors.last_name ? "error" : "default"}
            value={formData.last_name}
          />
        </div>

        {/* Address fields */}
        <FormInput
          helpText={errors.address_1}
          id="address_1"
          label="Address Line 1"
          onBlur={() => handleFieldBlur("address_1")}
          onChange={(e) => handleFieldChange("address_1", e.target.value)}
          placeholder="Street address"
          required
          validateStatus={errors.address_1 ? "error" : "default"}
          value={formData.address_1}
        />

        <FormInput
          id="address_2"
          label="Address Line 2"
          onChange={(e) => handleFieldChange("address_2", e.target.value)}
          placeholder="Apartment, suite, etc. (optional)"
          value={formData.address_2}
        />

        {/* City and Postal Code */}
        <div className="grid grid-cols-2 gap-300">
          <FormInput
            helpText={errors.city}
            id="city"
            label="City"
            onBlur={() => handleFieldBlur("city")}
            onChange={(e) => handleFieldChange("city", e.target.value)}
            placeholder="Prague"
            required
            validateStatus={errors.city ? "error" : "default"}
            value={formData.city}
          />
          <FormInput
            helpText={errors.postal_code}
            id="postal_code"
            label="Postal Code"
            onBlur={() => handleFieldBlur("postal_code")}
            onChange={(e) => handleFieldChange("postal_code", e.target.value)}
            placeholder={formData.country_code === "cz" ? "110 00" : "811 01"}
            required
            validateStatus={errors.postal_code ? "error" : "default"}
            value={formData.postal_code}
          />
        </div>

        {/* Country and Phone */}
        <div className="grid grid-cols-2 gap-300">
          <Select
            id="country_code"
            label="Country"
            onValueChange={(details) => {
              const value = details.value[0]
              if (value) {
                handleFieldChange("country_code", value)
                // Clear postal code error when country changes
                if (errors.postal_code) {
                  handleFieldBlur("postal_code")
                }
              }
            }}
            options={COUNTRY_OPTIONS}
            required
            value={[formData.country_code]}
          />
          <FormInput
            helpText={errors.phone}
            id="phone"
            label="Phone"
            onBlur={() => handleFieldBlur("phone")}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            placeholder="+420 123 456 789"
            type="tel"
            validateStatus={errors.phone ? "error" : "default"}
            value={formData.phone}
          />
        </div>
      </div>
    </Dialog>
  )
}
