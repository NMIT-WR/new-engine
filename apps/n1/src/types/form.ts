/**
 * Form types and utilities for TanStack Form
 */

/**
 * A permissive FieldApi type that accepts any field from any form.
 * Use this for reusable field components that should work with any form structure.
 *
 * This type extracts only the properties used by field components,
 * avoiding variance issues with generic parameters.
 */
export type AnyFieldApiCompat = {
  name: string
  state: {
    value: unknown
    meta: {
      isTouched: boolean
      isBlurred: boolean
      isDirty: boolean
      isValidating: boolean
      errors: readonly unknown[] // More permissive to accept TanStack Form's complex error types
      errorMap: Record<string, unknown>
    }
  }
  handleChange: (value: unknown) => void
  handleBlur: () => void
  // Add other methods/properties as needed by field components
}
