"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useToast } from "@techsio/ui-kit/molecules/toast"
import { useCallback, useMemo, useState } from "react"
import { STORAGE_KEYS } from "@/lib/constants"
import { queryKeys } from "@/lib/query-keys"
import { orderHelpers } from "@/stores/order-store"
import type { CheckoutAddressData, UseCheckoutReturn } from "@/types/checkout"
import { authHooks } from "./auth-hooks"
import { cartHooks, isNotFoundError } from "./cart-hooks"
import { checkoutHooks } from "./checkout-hooks"
import { customerHooks } from "./customer-hooks"

export function useCheckout(): UseCheckoutReturn {
  const queryClient = useQueryClient()
  const { cart, query: cartQuery } = cartHooks.useCart({})
  const { customer: user } = authHooks.useAuth()
  const { addresses } = customerHooks.useCustomerAddresses({
    enabled: !!user,
  })
  const toast = useToast()

  const shippingCacheKey =
    typeof cart?.updated_at === "string"
      ? cart.updated_at
      : cart?.updated_at instanceof Date
        ? cart.updated_at.toISOString()
        : undefined

  const {
    shippingOptions,
    isLoading: isLoadingShipping,
    isFetching: isFetchingShipping,
    setShippingMethodAsync,
  } = checkoutHooks.useCheckoutShipping({
    cartId: cart?.id,
    cart,
    enabled: !!cart?.id,
    calculatePrices: false,
    cacheKey: shippingCacheKey,
  })

  const { initiatePaymentAsync } = checkoutHooks.useCheckoutPayment({
    cartId: cart?.id,
    regionId: cart?.region_id ?? undefined,
    cart,
    enabled: !!cart?.region_id,
  })

  const shippingMethods = useMemo(
    () =>
      shippingOptions.map((option) => ({
        id: option.id,
        name: option.name,
        calculated_price: option.calculated_price,
      })),
    [shippingOptions]
  )

  // Get the first address and map to FormAddressData format
  const mainAddress = addresses[0]
  const address = mainAddress
    ? {
        street: mainAddress.address_1 || "",
        city: mainAddress.city || "",
        postalCode: mainAddress.postal_code || "",
        country: mainAddress.country_code || "cz",
      }
    : null

  const refetchCart = useCallback(async () => {
    const result = await cartQuery.refetch()
    return result.data ?? cart ?? null
  }, [cartQuery, cart])

  // Complete cart mutation with automatic cart clearing
  const completeCartMutation = cartHooks.useCompleteCart({
    clearCartOnSuccess: true,
    onSuccess: (result) => {
      if (result.type === "order") {
        orderHelpers.saveCompletedOrder(result.order)
        queryClient.removeQueries({ queryKey: queryKeys.cart.all() })
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() })
      }
    },
    onError: (error) => {
      console.error("Order creation error:", error)
      toast.create({
        title: "Chyba při vytváření objednávky",
        description:
          error instanceof Error
            ? error.message
            : "Něco se pokazilo. Zkuste to prosím znovu.",
        type: "error",
      })
    },
  })

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedPayment, setSelectedPayment] = useState("")
  const [selectedShipping, setSelectedShipping] = useState("")
  const [addressData, setAddressData] = useState<CheckoutAddressData | null>(
    null
  )
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Update cart address mutation
  const updateAddressMutation = cartHooks.useUpdateCartAddress({
    onError: (err) => {
      console.error("Failed to update cart with addresses:", err)
      if (isNotFoundError(err)) {
        // Clear stale cart and invalidate queries
        localStorage.removeItem(STORAGE_KEYS.CART_ID)
        queryClient.invalidateQueries({ queryKey: queryKeys.cart.all() })
        toast.create({
          title: "Košík byl resetován",
          description: "Váš košík byl neplatný. Přidejte prosím položky znovu.",
          type: "warning",
        })
      } else {
        toast.create({
          title: "Chyba při ukládání adresy",
          description: "Zkuste to prosím znovu",
          type: "error",
        })
      }
    },
  })

  // Update addresses in cart
  const updateAddresses = async (data: CheckoutAddressData) => {
    if (!cart?.id) {
      return
    }

    const shippingAddr = {
      first_name: data.shipping.firstName,
      last_name: data.shipping.lastName,
      address_1: data.shipping.street,
      city: data.shipping.city,
      postal_code: data.shipping.postalCode,
      phone: data.shipping.phone,
      country_code: (data.shipping.country || "CZ").toLowerCase(),
      company: data.shipping.company,
    }

    await updateAddressMutation.mutateAsync({
      cartId: cart.id,
      email: data.shipping.email,
      shippingAddress: shippingAddr,
      billingAddress: data.useSameAddress
        ? undefined
        : {
            first_name: data.billing.firstName,
            last_name: data.billing.lastName,
            address_1: data.billing.street,
            city: data.billing.city,
            postal_code: data.billing.postalCode,
            country_code: (data.billing.country || "CZ").toLowerCase(),
            company: data.billing.company,
          },
      useSameAddress: data.useSameAddress,
    })
    setAddressData(data)
  }

  const shippingError = null

  // Add shipping method to cart
  const addShippingMethod = async (methodId: string) => {
    if (!cart?.id) {
      return
    }

    try {
      await setShippingMethodAsync(methodId)
      await refetchCart()
    } catch (error) {
      console.error("Failed to add shipping method:", error)
      toast.create({
        title: "Chyba při výběru dopravy",
        description: "Zkuste to prosím znovu",
        type: "error",
      })
      throw error
    }
  }

  // Process order
  const processOrder = async () => {
    if (!cart?.id) {
      return
    }

    setIsProcessingPayment(true)

    try {
      const currentCart = await refetchCart()
      if (!currentCart) {
        return
      }

      // Check shipping method
      if (
        !currentCart.shipping_methods ||
        currentCart.shipping_methods.length === 0
      ) {
        toast.create({
          title: "Chyba",
          description: "Prosím vyberte způsob dopravy",
          type: "error",
        })
        setCurrentStep(1)
        return
      }

      let cartForPayment = currentCart
      const needsPaymentCollection = !cartForPayment.payment_collection
      const needsPaymentSession =
        !cartForPayment.payment_collection?.payment_sessions ||
        cartForPayment.payment_collection.payment_sessions.length === 0

      if (needsPaymentCollection || needsPaymentSession) {
        if (!cartForPayment.region_id) {
          toast.create({
            title: "Chyba",
            description: "Košík nemá nastavený region",
            type: "error",
          })
          return
        }
        const regionId = cartForPayment.region_id

        const availablePaymentProviders =
          await checkoutHooks.fetchPaymentProviders(queryClient, regionId)

        const providerId =
          availablePaymentProviders.find(
            (provider) => provider.id === selectedPayment
          )?.id ?? availablePaymentProviders[0]?.id

        if (!providerId) {
          toast.create({
            title: "Chyba",
            description: "Není dostupný poskytovatel platby",
            type: "error",
          })
          return
        }

        await initiatePaymentAsync(providerId)

        const refreshed = await refetchCart()
        if (refreshed) {
          cartForPayment = refreshed
        }
      }

      // Complete order using the hook mutation
      // onSuccess/onError are handled by the mutation callbacks
      const result = await completeCartMutation.mutateAsync({
        cartId: cart.id,
      })

      if (result.type === "order") {
        return result.order
      }
    } finally {
      setIsProcessingPayment(false)
    }
  }

  // Check if can proceed to step
  const canProceedToStep = (step: number) => {
    const hasAddress = Boolean(addressData || cart?.shipping_address || address)
    switch (step) {
      case 1: // Shipping
        return hasAddress
      case 2: // Payment
        return hasAddress && !!selectedShipping
      case 3: // Summary
        return hasAddress && !!selectedShipping && !!selectedPayment
      default:
        return true
    }
  }

  return {
    // State
    currentStep,
    selectedPayment,
    selectedShipping,
    addressData,
    isProcessingPayment,
    shippingMethods,
    isLoadingShipping: isLoadingShipping || isFetchingShipping,
    shippingError,

    // Actions
    setCurrentStep,
    setSelectedPayment,
    setSelectedShipping,
    setAddressData,
    updateAddresses,
    addShippingMethod,
    processOrder,
    canProceedToStep,
  }
}






