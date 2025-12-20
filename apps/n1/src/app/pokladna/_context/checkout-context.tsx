"use client"

import { useRouter } from "next/navigation"
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import {
  FormProvider,
  type UseFormReturn,
  useForm,
  useFormContext,
} from "react-hook-form"
import { useAuth } from "@/hooks/use-auth"
import { useCart, useCompleteCart } from "@/hooks/use-cart"
import { useCheckoutPayment } from "@/hooks/use-checkout-payment"
import { useCheckoutShipping } from "@/hooks/use-checkout-shipping"
import { useRegion } from "@/hooks/use-region"
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

type CheckoutContextValue = {
  form: UseFormReturn<CheckoutFormData>
  cart: ReturnType<typeof useCart>["cart"]
  isCartLoading: boolean
  hasItems: boolean
  shipping: ReturnType<typeof useCheckoutShipping>
  payment: ReturnType<typeof useCheckoutPayment>
  customer: ReturnType<typeof useAuth>["customer"]
  selectedAddressId: string | null
  setSelectedAddressId: (id: string | null) => void
  completeCheckout: () => Promise<void>
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
  const { customer } = useAuth()
  const { cart, isLoading: isCartLoading, hasItems } = useCart()
  const { regionId } = useRegion()
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

  // Initialize form with default values
  const form = useForm<CheckoutFormData>({
    defaultValues: {
      email: customer?.email ?? "",
      billingAddress: DEFAULT_ADDRESS,
    },
    mode: "onBlur",
  })

  // Initialize form with existing data (cart address > customer default)
  // Only runs ONCE on initial data load, not on subsequent customer.addresses changes
  useEffect(() => {
    // Skip if already initialized (prevents reset after saving address)
    if (isFormInitialized.current) {
      return
    }

    // Priority 1: Cart already has billing address
    if (cart?.billing_address?.first_name) {
      const addressData = addressToFormData(
        cart.billing_address
      ) as AddressFormData
      form.reset({ email: cart.email, billingAddress: addressData })
      isFormInitialized.current = true
      return
    }

    // Priority 2: Customer has saved addresses
    if (customer?.addresses && customer.addresses.length > 0) {
      const defaultAddress = getDefaultAddress(customer.addresses)
      if (defaultAddress) {
        const addressData = addressToFormData(defaultAddress) as AddressFormData
        form.reset({ billingAddress: addressData })
        setSelectedAddressId(defaultAddress.id)
        isFormInitialized.current = true
      }
    }
  }, [cart?.billing_address, cart?.email, customer?.addresses, form])

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

  const completeCheckout = form.handleSubmit(async (data) => {
    if (!cart?.id) {
      setError("Košík nebyl nalezen")
      return
    }

    setError(null)

    const { email, billingAddress } = data

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
  })

  // Compute isReady based on form validity and selections
  const formState = form.formState
  const isAddressValid =
    formState.isValid || Object.keys(formState.errors).length === 0

  // Check if selected shipping requires access point
  const requiresAccessPoint =
    shipping.selectedOption && isPPLParcelOption(shipping.selectedOption.name)
  const hasRequiredAccessPoint = !requiresAccessPoint || !!selectedAccessPoint

  const isReady =
    isAddressValid &&
    !!shipping.selectedShippingMethodId &&
    hasRequiredAccessPoint &&
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
    // PPL Parcel state
    selectedAccessPoint,
    setSelectedAccessPoint,
    isPickupDialogOpen,
    openPickupDialog,
    closePickupDialog,
    pendingOptionId,
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
    throw new Error("useCheckoutContext must be used within CheckoutProvider")
  }
  return context
}

/** Shorthand for useFormContext with CheckoutFormData typing */
export function useCheckoutForm() {
  return useFormContext<CheckoutFormData>()
}
