"use client"

import { useForm } from "@tanstack/react-form"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { authHooks } from "@/hooks/auth-hooks"
import { useCheckoutPayment } from "@/hooks/checkout-payment"
import { useCheckoutShipping } from "@/hooks/checkout-shipping"
import { useSuspenseRegion } from "@/hooks/region-hooks"
import {
  usePickupPointShipping,
  type UsePickupPointShippingReturn,
} from "@/hooks/use-pickup-point-shipping"
import { queryKeys } from "@/lib/query-keys"
import { cartHooks } from "@/hooks/cart-hooks"
import {
  addressToFormData,
  DEFAULT_ADDRESS,
  getDefaultAddress,
} from "@/utils/address-helpers"
import type { AddressFormData } from "@/utils/address-validation"

export type CheckoutFormData = {
  email?: string
  billingAddress: AddressFormData
}

/** Helper to infer the correct form type - not actually called */
const _formTypeHelper = (d: CheckoutFormData) => useForm({ defaultValues: d })

/** Form type for checkout - inferred from useForm return type */
type CheckoutForm = ReturnType<typeof _formTypeHelper>

type InitialCheckoutState = {
  defaultValues: CheckoutFormData
  selectedAddressId: string | null
}

type SuspenseCartResult = ReturnType<(typeof cartHooks)["useSuspenseCart"]>

const resolveInitialCheckoutState = (
  cart: SuspenseCartResult["cart"],
  customer: ReturnType<typeof authHooks.useSuspenseAuth>["customer"]
): InitialCheckoutState => {
  if (cart?.billing_address?.first_name) {
    const addressData = addressToFormData(
      cart.billing_address
    ) as AddressFormData

    return {
      defaultValues: {
        email: cart.email ?? customer?.email ?? "",
        billingAddress: addressData,
      },
      selectedAddressId: null,
    }
  }

  if (customer?.addresses && customer.addresses.length > 0) {
    const defaultAddress = getDefaultAddress(customer.addresses)
    if (defaultAddress) {
      const addressData = addressToFormData(defaultAddress) as AddressFormData
      return {
        defaultValues: {
          email: customer?.email ?? "",
          billingAddress: addressData,
        },
        selectedAddressId: defaultAddress.id,
      }
    }
  }

  return {
    defaultValues: {
      email: customer?.email ?? "",
      billingAddress: DEFAULT_ADDRESS,
    },
    selectedAddressId: null,
  }
}

type CheckoutContextValue = {
  form: CheckoutForm
  cart: SuspenseCartResult["cart"]
  hasItems: boolean
  shipping: ReturnType<typeof useCheckoutShipping>
  payment: ReturnType<typeof useCheckoutPayment>
  customer: ReturnType<typeof authHooks.useSuspenseAuth>["customer"]
  selectedAddressId: string | null
  setSelectedAddressId: (id: string | null) => void
  completeCheckout: () => void
  isCompleting: boolean
  error: string | null
  isReady: boolean
  // PPL Parcel - consolidated into single hook
  pickupPoint: UsePickupPointShippingReturn
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null)

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { customer } = authHooks.useSuspenseAuth()
  const { cart, hasItems } = cartHooks.useSuspenseCart({})
  const { regionId } = useSuspenseRegion()

  const shipping = useCheckoutShipping(cart?.id, cart)
  const payment = useCheckoutPayment(cart?.id, regionId, cart)

  const { mutateAsync: updateCartAddressAsync, isPending: isSavingAddress } =
    cartHooks.useUpdateCartAddress()
  const { mutateAsync: completeCartAsync, isPending: isCompletingCart } =
    cartHooks.useCompleteCart({
      onSuccess: (result) => {
        if (result.success) {
          queryClient.removeQueries({ queryKey: queryKeys.cart.all() })
          queryClient.setQueryData(
            queryKeys.orders.detail(result.order.id),
            result.order
          )
          queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() })
          router.push(`/orders/${result.order.id}?success=true`)
          return
        }

        if (result.cart?.id) {
          queryClient.setQueryData(
            queryKeys.cart.active({
              cartId: result.cart.id,
              regionId: result.cart.region_id ?? null,
            }),
            result.cart
          )
        }
      },
    })

  const initialStateRef = useRef<InitialCheckoutState | null>(null)
  if (!initialStateRef.current) {
    initialStateRef.current = resolveInitialCheckoutState(cart, customer)
  }

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    initialStateRef.current.selectedAddressId
  )
  const [error, setError] = useState<string | null>(null)

  // PPL Parcel pickup point selection - consolidated into single hook
  const pickupPoint = usePickupPointShipping()

  const form = useForm({
    defaultValues: initialStateRef.current.defaultValues,
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: checkout flow includes many validation branches
    onSubmit: async ({ value }: { value: CheckoutFormData }) => {
      if (!cart?.id) {
        setError("Košík nebyl nalezen")
        return
      }

      setError(null)

      const { email, billingAddress } = value

      // Determine shipping address based on delivery method
      // If PPL Parcel selected + access point → shipping = access point address
      // Otherwise → shipping = billing address
      const shippingAddress =
        pickupPoint.getShippingAddress(billingAddress) ?? billingAddress

      // Save both addresses to cart
      try {
        const cartEmail = customer?.email || email
        await updateCartAddressAsync({
          cartId: cart.id,
          billingAddress,
          shippingAddress,
          email: cartEmail,
        })
      } catch (err) {
        if (err instanceof Error) {
          if (
            err.message.includes("billing") ||
            err.message.includes("faktur")
          ) {
            setError(`Chyba fakturační adresy: ${err.message}`)
          } else if (
            err.message.includes("shipping") ||
            err.message.includes("doruč")
          ) {
            setError(`Chyba doručovací adresy: ${err.message}`)
          } else if (err.message.includes("Validation")) {
            setError(`Neplatná adresa: ${err.message}`)
          } else {
            setError(`Nepodařilo se uložit adresu: ${err.message}`)
          }
        } else {
          setError("Nepodařilo se uložit adresu")
        }
        return
      }

      // Complete the cart
      try {
        await completeCartAsync({ cartId: cart.id })
      } catch (err) {
        if (err instanceof Error) {
          if (
            err.message.includes("payment") ||
            err.message.includes("platb")
          ) {
            setError(`Chyba platby: ${err.message}`)
          } else if (
            err.message.includes("stock") ||
            err.message.includes("sklad")
          ) {
            setError(`Některé produkty nejsou skladem: ${err.message}`)
          } else {
            setError(`Nepodařilo se dokončit objednávku: ${err.message}`)
          }
        } else {
          setError("Nepodařilo se dokončit objednávku")
        }
      }
    },
  })

  // Auto-select PPL Private as default (PPL Parcel requires dialog)
  // NOTE: Options 0-6 use manual_manual provider which is disabled on backend
  useEffect(() => {
    if (
      shipping.shippingOptions &&
      shipping.shippingOptions.length > 0 &&
      !shipping.selectedShippingMethodId
    ) {
      // Find PPL Private option (doesn't require access point selection)
      const pplPrivate = shipping.shippingOptions.find((opt) =>
        opt.name.toLowerCase().includes("ppl private")
      )
      if (pplPrivate) {
        shipping.setShipping(pplPrivate.id)
      }
      // Don't auto-select if no PPL Private found - let user choose manually
    }
  }, [shipping.shippingOptions, shipping.selectedShippingMethodId, shipping])

  // Reset access point when switching to non-parcel shipping method
  const selectedOptionName = shipping.selectedOption?.name
  const hasAccessPointSelected = pickupPoint.hasSelection
  useEffect(() => {
    // If switched to non-parcel option and we have a selection, clear it
    if (
      selectedOptionName &&
      !pickupPoint.requiresAccessPoint(selectedOptionName) &&
      hasAccessPointSelected
    ) {
      pickupPoint.clearSelection()
    }
    // Note: pickupPoint functions are stable (don't depend on changing state)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptionName, hasAccessPointSelected])

  const completeCheckout = () => {
    form.handleSubmit()
  }

  // Check if selected shipping requires access point
  const requiresAccessPoint = pickupPoint.requiresAccessPoint(
    shipping.selectedOption?.name
  )
  const hasRequiredAccessPoint = !requiresAccessPoint || pickupPoint.hasSelection

  const isReady =
    form.state.isValid &&
    !!shipping.selectedShippingMethodId &&
    hasRequiredAccessPoint &&
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
    // PPL Parcel - consolidated into single hook
    pickupPoint,
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
