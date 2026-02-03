"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@techsio/ui-kit/molecules/toast"
import { useCallback, useState } from "react"
import { cacheConfig } from "@/lib/cache-config"
import { STORAGE_KEYS } from "@/lib/constants"
import { sdk } from "@/lib/medusa-client"
import { queryKeys } from "@/lib/query-keys"
import { orderHelpers } from "@/stores/order-store"
import type { CheckoutAddressData, UseCheckoutReturn } from "@/types/checkout"
import { authHooks } from "./auth-hooks"
import { cartHooks, isNotFoundError } from "./cart-hooks"
import { customerHooks } from "./customer-hooks"

export function useCheckout(): UseCheckoutReturn {
  const queryClient = useQueryClient()
  const { cart } = cartHooks.useCart({})
  const { customer: user } = authHooks.useAuth()
  const { addresses } = customerHooks.useCustomerAddresses({
    enabled: !!user,
  })
  const toast = useToast()

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

  // Refetch cart data by invalidating the query
  const refetch = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.cart.all() })
  }, [queryClient])

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

  const {
    data: shippingMethods,
    isLoading: isLoadingShipping,
    error: shippingError,
  } = useQuery({
    queryKey: queryKeys.fulfillment.cartOptions(cart?.id || ""),
    queryFn: async () => {
      if (!cart?.id) {
        throw new Error("No cart ID available")
      }
      const response = await sdk.store.fulfillment.listCartOptions({
        cart_id: cart.id,
      })

      const reducedShippingMethods = response.shipping_options.map((o) => ({
        id: o.id,
        name: o.name,
        calculated_price: o.calculated_price,
      }))
      return reducedShippingMethods
    },
    enabled: !!cart?.id,
    ...cacheConfig.semiStatic,
  })

  // Add shipping method to cart
  const addShippingMethod = async (methodId: string) => {
    if (!cart?.id) {
      return
    }

    try {
      await sdk.store.cart.addShippingMethod(cart.id, {
        option_id: methodId,
      })
      await refetch()
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
      // Get fresh cart state
      const { cart: currentCart } = await sdk.store.cart.retrieve(cart.id)

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

      // Initialize payment if needed
      if (!currentCart.payment_collection) {
        if (!currentCart.region_id) {
          toast.create({
            title: "Chyba",
            description: "Košík nemá nastavenou region",
            type: "error",
          })
          return
        }

        const providers = await sdk.store.payment.listPaymentProviders({
          region_id: currentCart.region_id,
        })

        const providerId =
          providers.payment_providers?.find(
            (provider) => provider.id === selectedPayment
          )?.id ?? providers.payment_providers?.[0]?.id

        if (providerId) {
          await sdk.store.payment.initiatePaymentSession(currentCart, {
            provider_id: providerId,
          })
        }
      }

      // Refresh cart to get payment collection
      const { cart: latestCart } = await sdk.store.cart.retrieve(cart.id)

      // Create payment session if needed
      if (
        !latestCart.payment_collection?.payment_sessions ||
        latestCart.payment_collection.payment_sessions.length === 0
      ) {
        const providers = await sdk.store.payment.listPaymentProviders({
          region_id: latestCart.region_id,
        })
        const providerId =
          providers.payment_providers?.find(
            (provider) => provider.id === selectedPayment
          )?.id ?? providers.payment_providers?.[0]?.id

        if (providerId) {
          await sdk.store.payment.initiatePaymentSession(latestCart, {
            provider_id: providerId,
          })
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
    isLoadingShipping,
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
