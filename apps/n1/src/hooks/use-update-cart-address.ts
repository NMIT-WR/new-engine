import { sdk } from '@/lib/medusa-client'
import { queryKeys } from '@/lib/query-keys'
import type { Cart } from '@/services/cart-service'
import type { AddressErrors, AddressFormData } from '@/utils/address-validation'
import { validateAddressForm } from '@/utils/address-validation'
import type { HttpTypes } from '@medusajs/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type UpdateCartAddressOptions = {
  onSuccess?: (cart: Cart) => void
  onError?: (error: Error) => void
}

type MutationContext = {
  previousCart?: Cart
}

export function useUpdateCartAddress(options?: UpdateCartAddressOptions) {
  const queryClient = useQueryClient()

  return useMutation<
    Cart,
    Error,
    {
      cartId: string
      address: AddressFormData
      email?: string
    },
    MutationContext
  >({
    mutationFn: async ({ cartId, address, email }) => {
      console.log('[CartUpdate] Email being sent to Medusa:', email)
      if (!cartId) {
        throw new Error('Cart ID is required')
      }

      // Use centralized validation
      const validationErrors: AddressErrors = validateAddressForm(address)
      if (Object.keys(validationErrors).length > 0) {
        const errorMessages = Object.values(validationErrors).join(', ')
        throw new Error(`Validation failed: ${errorMessages}`)
      }

      // Clean up the address data (remove empty strings for optional fields)
      const cleanedAddress: HttpTypes.StoreUpdateCart['shipping_address'] = {
        first_name: address.first_name,
        last_name: address.last_name,
        address_1: address.address_1,
        city: address.city,
        postal_code: address.postal_code,
        country_code: address.country_code,
      }

      // Only add optional fields if they have values
      if (address.address_2?.trim()) {
        cleanedAddress.address_2 = address.address_2
      }
      if (address.company?.trim()) {
        cleanedAddress.company = address.company
      }
      if (address.province?.trim()) {
        cleanedAddress.province = address.province
      }
      if (address.phone?.trim()) {
        cleanedAddress.phone = address.phone
      }

      // Update the cart with the shipping address
      const response = await sdk.store.cart.update(cartId, {
        shipping_address: cleanedAddress,
        email: email || undefined,
      })

      if (!response.cart) {
        throw new Error('Failed to update shipping address')
      }

      return response.cart
    },
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.active() })

      // Snapshot the previous cart
      const previousCart = queryClient.getQueryData<Cart>(
        queryKeys.cart.active()
      )

      // Return context with previous cart for rollback
      return { previousCart }
    },
    onSuccess: (cart) => {
      // Update cache with new cart data
      queryClient.setQueryData(queryKeys.cart.active(), cart)

      options?.onSuccess?.(cart)
    },
    onError: (error, _variables, context) => {
      // Rollback to previous cart on error
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.active(), context.previousCart)
      }

      options?.onError?.(error)
    },
    onSettled: () => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.active() })
    },
  })
}
