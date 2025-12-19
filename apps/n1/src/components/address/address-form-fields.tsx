'use client'

import { FormField } from '@/components/molecules/form-field'
import { COUNTRY_OPTIONS } from '@/lib/constants'
import type { AddressFormData } from '@/utils/address-validation'
import { ADDRESS_VALIDATION_RULES } from '@/utils/address-validation'
import { formatPhoneNumber } from '@/utils/format/format-phone-number'
import { formatPostalCode } from '@/utils/format/format-postal-code'
import { Select } from '@ui/molecules/select'
import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldPath,
} from 'react-hook-form'

// ============================================================================
// Types
// ============================================================================

/**
 * Form data type that supports both standalone and nested forms
 * - Standalone: { first_name, last_name, ... }
 * - Nested (checkout): { shippingAddress: { first_name, last_name, ... } }
 */
type FormWithAddress =
  | AddressFormData
  | { shippingAddress: AddressFormData }
  | Record<string, AddressFormData>

interface AddressFormFieldsProps<T extends FormWithAddress> {
  /** React Hook Form control */
  control: Control<T>
  /** Field errors for the address fields */
  errors?: FieldErrors<AddressFormData>
  /** Disable all fields */
  disabled?: boolean
  /**
   * Prefix for nested forms (e.g., "shippingAddress" for checkout)
   * When provided, field names become "shippingAddress.first_name" etc.
   */
  namePrefix?: string
}

// ============================================================================
// Component
// ============================================================================

/**
 * Shared address form fields with react-hook-form Controller components.
 * Can be used in:
 * - Checkout (with namePrefix="shippingAddress")
 * - Profile address list (standalone, no prefix)
 * - Address dialog (standalone, no prefix)
 *
 * Uses ADDRESS_VALIDATION_RULES for consistent validation across the app.
 */
export function AddressFormFields<T extends FormWithAddress>({
  control,
  errors,
  disabled,
  namePrefix,
}: AddressFormFieldsProps<T>) {
  // Helper to create field name with optional prefix
  const fieldName = (name: keyof AddressFormData): FieldPath<T> =>
    (namePrefix ? `${namePrefix}.${name}` : name) as FieldPath<T>

  return (
    <div className="flex flex-col gap-400">
      {/* First name | Last name */}
      <div className="grid grid-cols-2 gap-300">
        <Controller
          name={fieldName('first_name')}
          control={control}
          rules={ADDRESS_VALIDATION_RULES.first_name}
          render={({ field }) => (
            <FormField
              id="first_name"
              label="Jméno"
              name={field.name}
              type="text"
              value={field.value as string}
              onChange={field.onChange}
              onBlur={field.onBlur}
              errorMessage={errors?.first_name?.message}
              required
              minLength={2}
              disabled={disabled}
            />
          )}
        />
        <Controller
          name={fieldName('last_name')}
          control={control}
          rules={ADDRESS_VALIDATION_RULES.last_name}
          render={({ field }) => (
            <FormField
              id="last_name"
              label="Příjmení"
              name={field.name}
              type="text"
              value={field.value as string}
              onChange={field.onChange}
              onBlur={field.onBlur}
              errorMessage={errors?.last_name?.message}
              required
              minLength={2}
              disabled={disabled}
            />
          )}
        />
      </div>

      {/* Company (optional) */}
      <Controller
        name={fieldName('company')}
        control={control}
        render={({ field }) => (
          <FormField
            id="company"
            label="Firma (volitelné)"
            name={field.name}
            type="text"
            value={(field.value as string) || ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={disabled}
          />
        )}
      />

      {/* Address */}
      <Controller
        name={fieldName('address_1')}
        control={control}
        rules={ADDRESS_VALIDATION_RULES.address_1}
        render={({ field }) => (
          <FormField
            id="address_1"
            label="Adresa"
            name={field.name}
            type="text"
            value={field.value as string}
            onChange={field.onChange}
            onBlur={field.onBlur}
            errorMessage={errors?.address_1?.message}
            required
            minLength={3}
            disabled={disabled}
            placeholder="Ulice a číslo popisné"
          />
        )}
      />

      {/* Apartment, suite, etc. (optional) */}
      <Controller
        name={fieldName('address_2')}
        control={control}
        render={({ field }) => (
          <FormField
            id="address_2"
            label="Byt, apartmá atd. (volitelné)"
            name={field.name}
            type="text"
            value={(field.value as string) || ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={disabled}
          />
        )}
      />

      {/* City | Country */}
      <div className="grid grid-cols-2 gap-300">
        <Controller
          name={fieldName('city')}
          control={control}
          rules={ADDRESS_VALIDATION_RULES.city}
          render={({ field }) => (
            <FormField
              id="city"
              label="Město"
              name={field.name}
              type="text"
              value={field.value as string}
              onChange={field.onChange}
              onBlur={field.onBlur}
              errorMessage={errors?.city?.message}
              required
              minLength={2}
              disabled={disabled}
            />
          )}
        />
        <Controller
          name={fieldName('country_code')}
          control={control}
          rules={ADDRESS_VALIDATION_RULES.country_code}
          render={({ field }) => (
            <Select
              id="country_code"
              label="Země"
              size="lg"
              clearIcon={false}
              options={COUNTRY_OPTIONS}
              value={[(field.value as string) || 'cz']}
              onValueChange={(details) => {
                const value = details.value[0]
                if (value) {
                  field.onChange(value)
                }
              }}
              disabled={disabled}
              className="grid grid-rows-[auto_1fr] [&_button]:h-full [&_button]:items-center"
            />
          )}
        />
      </div>

      {/* Province | Postal code */}
      <div className="grid grid-cols-2 gap-300">
        <Controller
          name={fieldName('province')}
          control={control}
          render={({ field }) => (
            <FormField
              id="province"
              label="Kraj (volitelné)"
              name={field.name}
              type="text"
              value={(field.value as string) || ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={disabled}
            />
          )}
        />
        <Controller
          name={fieldName('postal_code')}
          control={control}
          rules={ADDRESS_VALIDATION_RULES.postal_code}
          render={({ field }) => (
            <FormField
              id="postal_code"
              label="PSČ"
              name={field.name}
              type="text"
              value={field.value as string}
              onChange={(e) => {
                // Auto-format postal code
                field.onChange(formatPostalCode(e.target.value))
              }}
              onBlur={field.onBlur}
              errorMessage={errors?.postal_code?.message}
              required
              pattern="^\d{3}\s?\d{2}$"
              disabled={disabled}
              placeholder="110 00"
            />
          )}
        />
      </div>

      {/* Phone */}
      <Controller
        name={fieldName('phone')}
        control={control}
        rules={ADDRESS_VALIDATION_RULES.phone}
        render={({ field }) => (
          <FormField
            id="phone"
            label="Telefon (volitelné)"
            name={field.name}
            type="tel"
            value={(field.value as string) || ''}
            onChange={(e) => {
              // Auto-format phone number
              field.onChange(formatPhoneNumber(e.target.value))
            }}
            onBlur={field.onBlur}
            errorMessage={errors?.phone?.message}
            pattern="^(\+420|\+421)?\s?\d{3}\s?\d{3}\s?\d{3}$"
            disabled={disabled}
            placeholder="+420 123 456 789"
          />
        )}
      />
    </div>
  )
}
