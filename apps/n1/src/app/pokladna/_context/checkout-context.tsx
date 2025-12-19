"use client"

import { useForm } from "@tanstack/react-form"
import { useRouter } from "next/navigation"
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { useAuth } from "@/hooks/use-auth"
import { useCompleteCart, useSuspenseCart } from "@/hooks/use-cart"
import { useCheckoutPayment } from "@/hooks/use-checkout-payment"
import { useCheckoutShipping } from "@/hooks/use-checkout-shipping"
import { useSuspenseRegion } from "@/hooks/use-region"
import { useUpdateCartAddress } from "@/hooks/use-update-cart-address"
import {
  addressToFormData,
  DEFAULT_ADDRESS,
  getDefaultAddress,
} from "@/utils/address-helpers"
import type { AddressFormData } from "@/utils/address-validation"

export type CheckoutFormData = {
  email: string
  shippingAddress: AddressFormData
}

/**
 * Type helper - never called at runtime.
 * Lets TypeScript infer the correct form type with typed fields (email, shippingAddress).
 * Without this, ReturnType<typeof useForm> would give us a generic form without field types.
 */
const _formTypeHelper = (d: CheckoutFormData) => useForm({ defaultValues: d })

type CheckoutForm = ReturnType<typeof _formTypeHelper>

type CheckoutContextValue = {
  form: CheckoutForm
  cart: ReturnType<typeof useSuspenseCart>["cart"]
  hasItems: boolean
  shipping: ReturnType<typeof useCheckoutShipping>
  payment: ReturnType<typeof useCheckoutPayment>
  customer: ReturnType<typeof useAuth>["customer"]
  selectedAddressId: string | null
  setSelectedAddressId: (id: string | null) => void
  completeCheckout: () => void
  isCompleting: boolean
  error: string | null
  isReady: boolean
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null)

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const router = useRouter()

  const { customer } = useAuth()
  const { cart, hasItems } = useSuspenseCart()
  const { regionId } = useSuspenseRegion()

  const shipping = useCheckoutShipping(cart?.id, cart)
  const payment = useCheckoutPayment(cart?.id, regionId, cart)

  const { mutateAsync: updateCartAddressAsync, isPending: isSavingAddress } =
    useUpdateCartAddress()
  const { mutateAsync: completeCartAsync, isPending: isCompletingCart } =
    useCompleteCart({
      onSuccess: (order) => {
        router.push(`/orders/${order.id}?success=true`)
      },
    })

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)

  // Track if form has been initialized (prevents reset after address save)
  const isFormInitialized = useRef(false)

  // Initialize TanStack Form - let TypeScript infer types from defaultValues
  const defaultValues: CheckoutFormData = {
    email: customer?.email ?? "",
    shippingAddress: DEFAULT_ADDRESS,
  }
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (!cart?.id) {
        setError("Košík nebyl nalezen")
        return
      }

      setError(null)

      const { email, shippingAddress } = value

      // Save shipping address to cart
      try {
        const cartEmail = customer?.email || email
        await updateCartAddressAsync({
          cartId: cart.id,
          address: { ...shippingAddress },
          email: cartEmail,
        })
      } catch {
        setError("Problém s doručovací adresou")
        return
      }

      // Complete the cart
      try {
        await completeCartAsync({ cartId: cart.id })
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Nepodařilo se dokončit objednávku"
        setError(message)
      }
    },
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
      // Reset with new values to properly initialize without triggering isDirty
      form.reset({
        email: cart.email ?? "",
        shippingAddress: addressData,
      })
      isFormInitialized.current = true
      return
    }

    // Priority 2: Customer has saved addresses
    if (customer?.addresses && customer.addresses.length > 0) {
      const defaultAddress = getDefaultAddress(customer.addresses)
      if (defaultAddress) {
        const addressData = addressToFormData(defaultAddress) as AddressFormData
        form.reset({
          email: customer?.email ?? "",
          shippingAddress: addressData,
        })
        setSelectedAddressId(defaultAddress.id)
        isFormInitialized.current = true
      }
    }
  }, [cart?.shipping_address, cart?.email, customer?.addresses, customer?.email, form])

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

  // Submit handler
  const completeCheckout = () => {
    form.handleSubmit()
  }

  // Compute isReady based on form validity and selections
  const isReady =
    form.state.isValid &&
    !!shipping.selectedShippingMethodId &&
    payment.hasPaymentSessions &&
    !shipping.isSettingShipping &&
    !payment.isInitiatingPayment

  const contextValue: CheckoutContextValue = {
    form,
    cart,
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
    <CheckoutContext.Provider value={contextValue}>
      {children}
    </CheckoutContext.Provider>
  )
}

export function useCheckoutContext() {
  const context = useContext(CheckoutContext)
  if (!context) {
    throw new Error("useCheckoutContext must be used within CheckoutProvider")
  }
  return context
}

export function useCheckoutForm() {
  const { form } = useCheckoutContext()
  return form
}
