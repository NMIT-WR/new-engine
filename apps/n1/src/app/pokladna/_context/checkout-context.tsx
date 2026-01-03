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
import { useSuspenseAuth } from "@/hooks/use-auth"
import { useCompleteCart, useSuspenseCart } from "@/hooks/use-cart"
import { useCheckoutPayment } from "@/hooks/use-checkout-payment"
import { useCheckoutShipping } from "@/hooks/use-checkout-shipping"
import { useSuspenseRegion } from "@/hooks/use-region"
import { useUpdateCartAddress } from "@/hooks/use-update-cart-address"
import {
  accessPointToAddress,
  addressToFormData,
  DEFAULT_ADDRESS,
  getDefaultAddress,
  isPPLParcelOption,
  type PplAccessPointData,
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

type CheckoutContextValue = {
  form: CheckoutForm
  cart: ReturnType<typeof useSuspenseCart>["cart"]
  hasItems: boolean
  shipping: ReturnType<typeof useCheckoutShipping>
  payment: ReturnType<typeof useCheckoutPayment>
  customer: ReturnType<typeof useSuspenseAuth>["customer"]
  selectedAddressId: string | null
  setSelectedAddressId: (id: string | null) => void
  completeCheckout: () => void
  isCompleting: boolean
  error: string | null
  isReady: boolean
  // PPL Parcel state
  selectedAccessPoint: PplAccessPointData | null
  setSelectedAccessPoint: (accessPoint: PplAccessPointData | null) => void
  isPickupDialogOpen: boolean
  openPickupDialog: (optionId: string) => void
  closePickupDialog: () => void
  pendingOptionId: string | null
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null)

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const router = useRouter()

  const { customer } = useSuspenseAuth()
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

  const [selectedAccessPoint, setSelectedAccessPoint] =
    useState<PplAccessPointData | null>(null)
  const [isPickupDialogOpen, setIsPickupDialogOpen] = useState(false)
  const [pendingOptionId, setPendingOptionId] = useState<string | null>(null)

  const openPickupDialog = (optionId: string) => {
    setPendingOptionId(optionId)
    setIsPickupDialogOpen(true)
  }

  const closePickupDialog = () => {
    setIsPickupDialogOpen(false)
    setPendingOptionId(null)
  }

  // Track if form has been initialized (prevents reset after address save)
  const isFormInitialized = useRef(false)

  const defaultValues: CheckoutFormData = {
    email: customer?.email ?? "",
    billingAddress: DEFAULT_ADDRESS,
  }

  const form = useForm({
    defaultValues,
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
      const isPplParcel =
        shipping.selectedOption && isPPLParcelOption(shipping.selectedOption.name)

      let shippingAddress: AddressFormData
      if (isPplParcel && selectedAccessPoint) {
        shippingAddress = accessPointToAddress(
          selectedAccessPoint,
          billingAddress
        )
      } else {
        shippingAddress = billingAddress
      }

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
          if (err.message.includes("billing") || err.message.includes("faktur")) {
            setError("Chyba fakturační adresy: " + err.message)
          } else if (
            err.message.includes("shipping") ||
            err.message.includes("doruč")
          ) {
            setError("Chyba doručovací adresy: " + err.message)
          } else if (err.message.includes("Validation")) {
            setError("Neplatná adresa: " + err.message)
          } else {
            setError("Nepodařilo se uložit adresu: " + err.message)
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
          if (err.message.includes("payment") || err.message.includes("platb")) {
            setError("Chyba platby: " + err.message)
          } else if (
            err.message.includes("stock") ||
            err.message.includes("sklad")
          ) {
            setError("Některé produkty nejsou skladem: " + err.message)
          } else {
            setError("Nepodařilo se dokončit objednávku: " + err.message)
          }
        } else {
          setError("Nepodařilo se dokončit objednávku")
        }
      }
    },
  })

  // Initialize form with existing data (cart address > customer default)
  // Only runs ONCE on initial data load, not on subsequent customer.addresses changes
  useEffect(() => {
    if (isFormInitialized.current) {
      return
    }

    // Priority 1: Cart already has billing address
    if (cart?.billing_address?.first_name) {
      const addressData = addressToFormData(
        cart.billing_address
      ) as AddressFormData
      form.reset({ email: cart.email ?? "", billingAddress: addressData })
      isFormInitialized.current = true
      return
    }

    if (customer?.addresses && customer.addresses.length > 0) {
      const defaultAddress = getDefaultAddress(customer.addresses)
      if (defaultAddress) {
        const addressData = addressToFormData(defaultAddress) as AddressFormData
        form.reset({
          email: customer?.email ?? "",
          billingAddress: addressData,
        })
        setSelectedAddressId(defaultAddress.id)
        isFormInitialized.current = true
      }
    }
  }, [cart?.billing_address, cart?.email, customer?.addresses, customer?.email, form])

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
  useEffect(() => {
    // If switched to non-parcel option, clear access point
    if (
      shipping.selectedOption &&
      !isPPLParcelOption(shipping.selectedOption.name)
    ) {
      setSelectedAccessPoint(null)
    }
  }, [shipping.selectedOption])

  const completeCheckout = () => {
    form.handleSubmit()
  }

  // Check if selected shipping requires access point
  const requiresAccessPoint =
    shipping.selectedOption && isPPLParcelOption(shipping.selectedOption.name)
  const hasRequiredAccessPoint = !requiresAccessPoint || !!selectedAccessPoint

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
    // PPL Parcel state
    selectedAccessPoint,
    setSelectedAccessPoint,
    isPickupDialogOpen,
    openPickupDialog,
    closePickupDialog,
    pendingOptionId,
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
