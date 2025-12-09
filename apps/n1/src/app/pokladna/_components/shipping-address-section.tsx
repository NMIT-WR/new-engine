'use client'

import { FormField } from '@/components/molecules/form-field'
import { COUNTRY_OPTIONS } from '@/lib/constants'
import type { AddressFormData } from '@/utils/address-validation'
import {
  ADDRESS_VALIDATION_RULES,
  EMAIL_VALIDATION_RULES,
} from '@/utils/address-validation'
import { formatPhoneNumber } from '@/utils/format/format-phone-number'
import { formatPostalCode } from '@/utils/format/format-postal-code'
import { Select } from '@ui/molecules/select'
import { Controller } from 'react-hook-form'
import {
  useCheckoutContext,
  useCheckoutForm,
} from '../_context/checkout-context'
import { AddressPicker } from './address-picker'
import { SaveAddressPanel } from './save-address-panel'

export function ShippingAddressSection() {
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
    reset({ shippingAddress: address })
    setSelectedAddressId(id)
  }

  return (
    <section className="rounded border border-border-secondary bg-surface/70 p-400">
      <div className="mb-400 space-y-300">
        <h2 className="font-semibold text-fg-primary text-lg">
          Doručovací adresa
        </h2>

        {addresses.length > 0 && (
          <AddressPicker
            addresses={addresses}
            selectedId={selectedAddressId}
            onSelect={handleAddressSelect}
            disabled={isCompleting}
          />
        )}
      </div>

      <form className="flex flex-col gap-400">
        {/* First name | Last name */}
        <div className="grid grid-cols-2 gap-300">
          <Controller
            name="shippingAddress.first_name"
            control={control}
            rules={ADDRESS_VALIDATION_RULES.first_name}
            render={({ field, fieldState }) => (
              <FormField
                id="first_name"
                label="Jméno"
                name={field.name}
                type="text"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                errorMessage={fieldState.error?.message}
                required
                minLength={2}
                disabled={isCompleting}
              />
            )}
          />
          <Controller
            name="shippingAddress.last_name"
            control={control}
            rules={ADDRESS_VALIDATION_RULES.last_name}
            render={({ field, fieldState }) => (
              <FormField
                id="last_name"
                label="Příjmení"
                name={field.name}
                type="text"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                errorMessage={fieldState.error?.message}
                required
                minLength={2}
                disabled={isCompleting}
              />
            )}
          />
        </div>

        {/* Company (optional) */}
        <Controller
          name="shippingAddress.company"
          control={control}
          render={({ field }) => (
            <FormField
              id="company"
              label="Firma (volitelné)"
              name={field.name}
              type="text"
              value={field.value || ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={isCompleting}
            />
          )}
        />

        {/* Address */}
        <Controller
          name="shippingAddress.address_1"
          control={control}
          rules={ADDRESS_VALIDATION_RULES.address_1}
          render={({ field, fieldState }) => (
            <FormField
              id="address_1"
              label="Adresa"
              name={field.name}
              type="text"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              errorMessage={fieldState.error?.message}
              required
              minLength={3}
              disabled={isCompleting}
              placeholder="Ulice a číslo popisné"
            />
          )}
        />

        {/* Apartment, suite, etc. (optional) */}
        <Controller
          name="shippingAddress.address_2"
          control={control}
          render={({ field }) => (
            <FormField
              id="address_2"
              label="Byt, apartmá atd. (volitelné)"
              name={field.name}
              type="text"
              value={field.value || ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={isCompleting}
            />
          )}
        />

        {/* City | Country */}
        <div className="grid grid-cols-2 gap-300">
          <Controller
            name="shippingAddress.city"
            control={control}
            rules={ADDRESS_VALIDATION_RULES.city}
            render={({ field, fieldState }) => (
              <FormField
                id="city"
                label="Město"
                name={field.name}
                type="text"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                errorMessage={fieldState.error?.message}
                required
                minLength={2}
                disabled={isCompleting}
              />
            )}
          />
          <Controller
            name="shippingAddress.country_code"
            control={control}
            rules={ADDRESS_VALIDATION_RULES.country_code}
            render={({ field }) => (
              <Select
                id="country_code"
                label="Země"
                size="lg"
                clearIcon={false}
                options={COUNTRY_OPTIONS}
                value={[field.value || 'cz']}
                onValueChange={(details) => {
                  const value = details.value[0]
                  if (value) {
                    field.onChange(value)
                  }
                }}
                disabled={isCompleting}
                className="grid grid-rows-[auto_1fr] [&_button]:h-full [&_button]:items-center"
              />
            )}
          />
        </div>

        {/* State/Province | Postal code */}
        <div className="grid grid-cols-2 gap-300">
          <Controller
            name="shippingAddress.province"
            control={control}
            render={({ field }) => (
              <FormField
                id="province"
                label="Kraj (volitelné)"
                name={field.name}
                type="text"
                value={field.value || ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={isCompleting}
              />
            )}
          />
          <Controller
            name="shippingAddress.postal_code"
            control={control}
            rules={ADDRESS_VALIDATION_RULES.postal_code}
            render={({ field, fieldState }) => (
              <FormField
                id="postal_code"
                label="PSČ"
                name={field.name}
                type="text"
                value={field.value}
                onChange={(e) => {
                  // Auto-format postal code
                  field.onChange(formatPostalCode(e.target.value))
                }}
                onBlur={field.onBlur}
                errorMessage={fieldState.error?.message}
                required
                pattern={
                  ADDRESS_VALIDATION_RULES.postal_code.pattern.value.source
                }
                disabled={isCompleting}
                placeholder={field.value === 'cz' ? '110 00' : '811 01'}
              />
            )}
          />
        </div>

        {/* Phone */}
        <Controller
          name="shippingAddress.phone"
          control={control}
          rules={ADDRESS_VALIDATION_RULES.phone}
          render={({ field, fieldState }) => (
            <FormField
              id="phone"
              label="Telefon (volitelné)"
              name={field.name}
              type="tel"
              value={field.value || ''}
              onChange={(e) => {
                // Auto-format phone number
                field.onChange(formatPhoneNumber(e.target.value))
              }}
              onBlur={field.onBlur}
              errorMessage={fieldState.error?.message}
              pattern={ADDRESS_VALIDATION_RULES.phone.pattern.value.source}
              //pattern="^(\+420|\+421)?\s?\d{3}\s?\d{3}\s?\d{3}$"
              disabled={isCompleting}
              maxLength={11}
              placeholder="600 400 200"
            />
          )}
        />

        {/* EMAIL */}
        {!customer && (
          <Controller
            name="email"
            control={control}
            rules={EMAIL_VALIDATION_RULES}
            render={({ field, fieldState }) => (
              <FormField
                id="email"
                label="Email"
                name={field.name}
                type="email"
                value={field.value || ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                errorMessage={fieldState.error?.message}
                disabled={isCompleting}
                required
                placeholder="vas@email.cz"
              />
            )}
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
