'use client'

import { useAuth } from '@/hooks/use-auth'
import { useCart, useCompleteCart } from '@/hooks/use-cart'
import { useCheckoutPayment } from '@/hooks/use-checkout-payment'
import { useCheckoutShipping } from '@/hooks/use-checkout-shipping'
import { useRegion } from '@/hooks/use-region'
import { useUpdateCartAddress } from '@/hooks/use-update-cart-address'
import {
  DEFAULT_ADDRESS,
  addressToFormData,
  getDefaultAddress,
} from '@/utils/address-helpers'
import type { AddressFormData } from '@/utils/address-validation'
import { useRouter } from 'next/navigation'
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  FormProvider,
  type UseFormReturn,
  useForm,
  useFormContext,
} from 'react-hook-form'

export interface CheckoutFormData {
  email?: string
  shippingAddress: AddressFormData
}

interface CheckoutContextValue {
  form: UseFormReturn<CheckoutFormData>
  cart: ReturnType<typeof useCart>['cart']
  isCartLoading: boolean
  hasItems: boolean
  shipping: ReturnType<typeof useCheckoutShipping>
  payment: ReturnType<typeof useCheckoutPayment>
  customer: ReturnType<typeof useAuth>['customer']
  selectedAddressId: string | null
  setSelectedAddressId: (id: string | null) => void
  completeCheckout: () => Promise<void>
  isCompleting: boolean
  error: string | null
  isReady: boolean
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null)

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const router = useRouter()

  // Core data hooks
  const { customer } = useAuth()
  const { cart, isLoading: isCartLoading, hasItems } = useCart()
  const { regionId } = useRegion()

  // Checkout sub-hooks
  const shipping = useCheckoutShipping(cart?.id, cart)
  const payment = useCheckoutPayment(cart?.id, regionId, cart)

  // Mutations
  const { mutateAsync: updateCartAddressAsync, isPending: isSavingAddress } =
    useUpdateCartAddress()
  const { mutateAsync: completeCartAsync, isPending: isCompletingCart } =
    useCompleteCart({
      onSuccess: (order) => {
        router.push(`/orders/${order.id}?success=true`)
      },
    })

  // State
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)

  // Track if form has been initialized (prevents reset after address save)
  const isFormInitialized = useRef(false)

  // Initialize form with default values
  const form = useForm<CheckoutFormData>({
    defaultValues: {
      email: customer?.email ?? '',
      shippingAddress: DEFAULT_ADDRESS,
    },
    mode: 'onBlur',
  })

  // Initialize form with existing data (cart address > customer default)
  // Only runs ONCE on initial data load, not on subsequent customer.addresses changes
  useEffect(() => {
    // Skip if already initialized (prevents reset after saving address)
    if (isFormInitialized.current) {
      return
    }

    // Priority 1: Cart already has shipping address
    if (cart?.shipping_address?.first_name) {
      const addressData = addressToFormData(
        cart.shipping_address
      ) as AddressFormData
      form.reset({ email: cart.email, shippingAddress: addressData })
      isFormInitialized.current = true
      return
    }

    // Priority 2: Customer has saved addresses
    if (customer?.addresses && customer.addresses.length > 0) {
      const defaultAddress = getDefaultAddress(customer.addresses)
      if (defaultAddress) {
        const addressData = addressToFormData(defaultAddress) as AddressFormData
        form.reset({ shippingAddress: addressData })
        setSelectedAddressId(defaultAddress.id)
        isFormInitialized.current = true
      }
    }
  }, [cart?.shipping_address, cart?.email, customer?.addresses, form])

  // Auto-select first shipping option when loaded
  useEffect(() => {
    if (
      shipping.shippingOptions &&
      shipping.shippingOptions.length > 0 &&
      !shipping.selectedShippingMethodId
    ) {
      const firstOption = shipping.shippingOptions[0]
      shipping.setShipping(firstOption.id)
    }
  }, [shipping.shippingOptions, shipping.selectedShippingMethodId, shipping])

  const completeCheckout = form.handleSubmit(async (data) => {
    if (!cart?.id) {
      setError('Košík nebyl nalezen')
      return
    }

    setError(null)

    const { email, shippingAddress } = data

    // 2. Save shipping address to cart
    try {
      const cartEmail = customer?.email || email
      await updateCartAddressAsync({
        cartId: cart.id,
        address: { ...shippingAddress },
        email: cartEmail,
      })
    } catch (err) {
      setError('Problémy s doručovací adresu')
      return
    }

    // 3. Complete the cart
    try {
      await completeCartAsync({ cartId: cart.id })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Nepodařilo se dokončit objednávku'
      setError(message)
    }
  })

  // Compute isReady based on form validity and selections
  const formState = form.formState
  const isAddressValid =
    formState.isValid || Object.keys(formState.errors).length === 0
  const isReady =
    isAddressValid &&
    !!shipping.selectedShippingMethodId &&
    payment.hasPaymentSessions &&
    !shipping.isSettingShipping &&
    !payment.isInitiatingPayment

  const value: CheckoutContextValue = {
    form,
    cart,
    isCartLoading,
    hasItems,
    shipping,
    payment,
    customer,
    selectedAddressId,
    setSelectedAddressId,
    completeCheckout,
    isCompleting: isSavingAddress || isCompletingCart,
    error,
    isReady,
  }

  return (
    <CheckoutContext.Provider value={value}>
      <FormProvider {...form}>{children as React.ReactElement}</FormProvider>
    </CheckoutContext.Provider>
  )
}

export function useCheckoutContext() {
  const context = useContext(CheckoutContext)
  if (!context) {
    throw new Error('useCheckoutContext must be used within CheckoutProvider')
  }
  return context
}

/** Shorthand for useFormContext with CheckoutFormData typing */
export function useCheckoutForm() {
  return useFormContext<CheckoutFormData>()
}
