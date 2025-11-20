import { z } from 'zod'

// Centralized validation patterns (moved from inline code)
const POSTAL_CODE_PATTERNS = {
  cz: /^\d{3}\s?\d{2}$/,
  sk: /^\d{3}\s?\d{2}$/,
} as const

const PHONE_PATTERN = /^\+?[\d\s()-]+$/

/**
 * Address validation schema with country-specific rules
 * Used for checkout shipping address forms
 */
export const addressSchema = z
  .object({
    first_name: z
      .string()
      .min(1, 'First name is required')
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name is too long'),
    last_name: z
      .string()
      .min(1, 'Last name is required')
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name is too long'),
    address_1: z
      .string()
      .min(1, 'Address is required')
      .min(5, 'Please enter a valid address')
      .max(100, 'Address is too long'),
    address_2: z.string().optional(),
    city: z
      .string()
      .min(1, 'City is required')
      .min(2, 'Please enter a valid city name')
      .max(50, 'City name is too long'),
    postal_code: z.string().min(1, 'Postal code is required'),
    country_code: z.enum(['cz', 'sk'], {
      message: 'Please select a country',
    }),
    phone: z
      .string()
      .regex(PHONE_PATTERN, 'Please enter a valid phone number')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      // Country-specific postal code validation
      const pattern = POSTAL_CODE_PATTERNS[data.country_code]
      const cleaned = data.postal_code.replace(/\s/g, '')
      return pattern.test(cleaned)
    },
    {
      message: 'Invalid postal code format (expected: XXX XX)',
      path: ['postal_code'],
    }
  )

/**
 * TypeScript type inferred from schema
 * Ensures type safety across the application
 */
export type AddressFormData = z.infer<typeof addressSchema>

/**
 * Validation patterns exported for utilities
 */
export const validationPatterns = {
  postalCode: POSTAL_CODE_PATTERNS,
  phone: PHONE_PATTERN,
} as const
