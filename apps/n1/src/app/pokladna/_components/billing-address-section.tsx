"use client"

import { Select } from "@ui/molecules/select"
import { Controller } from "react-hook-form"
import { FormField } from "@/components/molecules/form-field"
import { COUNTRY_OPTIONS } from "@/lib/constants"
import type { AddressFormData } from "@/utils/address-validation"
import {
  ADDRESS_VALIDATION_RULES,
  EMAIL_VALIDATION_RULES,
} from "@/utils/address-validation"
import { formatPhoneNumber } from "@/utils/format/format-phone-number"
import { formatPostalCode } from "@/utils/format/format-postal-code"
import {
  useCheckoutContext,
  useCheckoutForm,
} from "../_context/checkout-context"
import { AddressPicker } from "./address-picker"
import { SaveAddressPanel } from "./save-address-panel"

export function BillingAddressSection() {
  const { customer, selectedAddressId, setSelectedAddressId, isCompleting } =
    useCheckoutContext()
  const {
    control,
    reset,
    formState: { errors },
  } = useCheckoutForm()

  const addresses = customer?.addresses || []

  // Handle address selection from picker
  const handleAddressSelect = (address: AddressFormData, id: string) => {
    // Use reset() to set values AND clear isDirty flag
    reset({ billingAddress: address })
    setSelectedAddressId(id)
  }

  return (
    <section className="rounded border border-border-secondary bg-surface/70 p-400">
      <div className="mb-400 space-y-300">
        <h2 className="font-semibold text-fg-primary text-lg">
          Fakturační adresa
        </h2>

        {addresses.length > 0 && (
          <AddressPicker
            addresses={addresses}
            disabled={isCompleting}
            onSelect={handleAddressSelect}
            selectedId={selectedAddressId}
          />
        )}
      </div>

      <form className="flex flex-col gap-400">
        {/* First name | Last name */}
        <div className="grid grid-cols-2 gap-300">
          <Controller
            control={control}
            name="billingAddress.first_name"
            render={({ field, fieldState }) => (
              <FormField
                disabled={isCompleting}
                errorMessage={fieldState.error?.message}
                id="first_name"
                label="Jméno"
                minLength={2}
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                required
                type="text"
                value={field.value}
              />
            )}
            rules={ADDRESS_VALIDATION_RULES.first_name}
          />
          <Controller
            control={control}
            name="billingAddress.last_name"
            render={({ field, fieldState }) => (
              <FormField
                disabled={isCompleting}
                errorMessage={fieldState.error?.message}
                id="last_name"
                label="Příjmení"
                minLength={2}
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                required
                type="text"
                value={field.value}
              />
            )}
            rules={ADDRESS_VALIDATION_RULES.last_name}
          />
        </div>

        {/* Company (optional) */}
        <Controller
          control={control}
          name="billingAddress.company"
          render={({ field }) => (
            <FormField
              disabled={isCompleting}
              id="company"
              label="Firma (volitelné)"
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              type="text"
              value={field.value || ""}
            />
          )}
        />

        {/* Address */}
        <Controller
          control={control}
          name="billingAddress.address_1"
          render={({ field, fieldState }) => (
            <FormField
              disabled={isCompleting}
              errorMessage={fieldState.error?.message}
              id="address_1"
              label="Adresa"
              minLength={3}
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              placeholder="Ulice a číslo popisné"
              required
              type="text"
              value={field.value}
            />
          )}
          rules={ADDRESS_VALIDATION_RULES.address_1}
        />

        {/* Apartment, suite, etc. (optional) */}
        <Controller
          control={control}
          name="billingAddress.address_2"
          render={({ field }) => (
            <FormField
              disabled={isCompleting}
              id="address_2"
              label="Byt, apartmá atd. (volitelné)"
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              type="text"
              value={field.value || ""}
            />
          )}
        />

        {/* City | Country */}
        <div className="grid grid-cols-2 gap-300">
          <Controller
            control={control}
            name="billingAddress.city"
            render={({ field, fieldState }) => (
              <FormField
                disabled={isCompleting}
                errorMessage={fieldState.error?.message}
                id="city"
                label="Město"
                minLength={2}
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                required
                type="text"
                value={field.value}
              />
            )}
            rules={ADDRESS_VALIDATION_RULES.city}
          />
          <Controller
            control={control}
            name="billingAddress.country_code"
            render={({ field }) => (
              <Select
                className="grid grid-rows-[auto_1fr] [&_button]:h-full [&_button]:items-center"
                clearIcon={false}
                disabled={isCompleting}
                id="country_code"
                label="Země"
                onValueChange={(details) => {
                  const value = details.value[0]
                  if (value) {
                    field.onChange(value)
                  }
                }}
                options={COUNTRY_OPTIONS}
                size="lg"
                value={[field.value || "cz"]}
              />
            )}
            rules={ADDRESS_VALIDATION_RULES.country_code}
          />
        </div>

        {/* State/Province | Postal code */}
        <div className="grid grid-cols-2 gap-300">
          <Controller
            control={control}
            name="billingAddress.province"
            render={({ field }) => (
              <FormField
                disabled={isCompleting}
                id="province"
                label="Kraj (volitelné)"
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                type="text"
                value={field.value || ""}
              />
            )}
          />
          <Controller
            control={control}
            name="billingAddress.postal_code"
            render={({ field, fieldState }) => (
              <FormField
                disabled={isCompleting}
                errorMessage={fieldState.error?.message}
                id="postal_code"
                label="PSČ"
                name={field.name}
                onBlur={field.onBlur}
                onChange={(e) => {
                  // Auto-format postal code
                  field.onChange(formatPostalCode(e.target.value))
                }}
                pattern={
                  ADDRESS_VALIDATION_RULES.postal_code.pattern.value.source
                }
                placeholder={field.value === "cz" ? "110 00" : "811 01"}
                required
                type="text"
                value={field.value}
              />
            )}
            rules={ADDRESS_VALIDATION_RULES.postal_code}
          />
        </div>

        {/* Phone */}
        <Controller
          control={control}
          name="billingAddress.phone"
          render={({ field, fieldState }) => (
            <FormField
              disabled={isCompleting}
              errorMessage={fieldState.error?.message}
              id="phone"
              label="Telefon (volitelné)"
              maxLength={11}
              name={field.name}
              onBlur={field.onBlur}
              onChange={(e) => {
                // Auto-format phone number
                field.onChange(formatPhoneNumber(e.target.value))
              }}
              pattern={ADDRESS_VALIDATION_RULES.phone.pattern.value.source}
              //pattern="^(\+420|\+421)?\s?\d{3}\s?\d{3}\s?\d{3}$"
              placeholder="600 400 200"
              type="tel"
              value={field.value || ""}
            />
          )}
          rules={ADDRESS_VALIDATION_RULES.phone}
        />

        {/* EMAIL */}
        {!customer && (
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <FormField
                disabled={isCompleting}
                errorMessage={fieldState.error?.message}
                id="email"
                label="Email"
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                placeholder="vas@email.cz"
                required
                type="email"
                value={field.value || ""}
              />
            )}
            rules={EMAIL_VALIDATION_RULES}
          />
        )}
      </form>

      {/* Save to profile panel (only for logged-in customers with changes) */}
      <SaveAddressPanel />

      {/* Info text for guests */}
      {!customer && (
        <p className="mt-400 text-fg-tertiary text-sm">
          Přihlaste se pro uložení adresy do svého účtu
        </p>
      )}
    </section>
  )
}
