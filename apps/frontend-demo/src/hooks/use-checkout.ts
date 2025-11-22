'use client'

import { cacheConfig } from '@/lib/cache-config'
import { STORAGE_KEYS } from '@/lib/constants'
import { sdk } from '@/lib/medusa-client'
import { queryKeys } from '@/lib/query-keys'
import { orderHelpers } from '@/stores/order-store'
import type {
  BalikovnaSelection,
  CheckoutAddressData,
  ReducedShippingMethod,
  UseCheckoutReturn,
} from '@/types/checkout'
import { useToast } from '@new-engine/ui/molecules/toast'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useCart } from './use-cart'
import { useCustomer } from './use-customer'

export function useCheckout(): UseCheckoutReturn {
  const { cart, refetch, clearCart } = useCart()
  const { address } = useCustomer()
  const toast = useToast()
  const queryClient = useQueryClient()

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedPayment, setSelectedPayment] = useState('')
  const [selectedShipping, setSelectedShipping] = useState('')
  const [addressData, setAddressData] = useState<CheckoutAddressData | null>(
    null
  )
  const [balikovnaSelection, setBalikovnaSelection] =
    useState<BalikovnaSelection | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Update addresses in cart
  const updateAddresses = async (data: CheckoutAddressData) => {
    if (!cart?.id) return

    try {
      await sdk.store.cart.update(cart.id, {
        email: data.shipping.email,
        shipping_address: {
          first_name: data.shipping.firstName,
          last_name: data.shipping.lastName,
          address_1: data.shipping.street,
          city: data.shipping.city,
          postal_code: data.shipping.postalCode,
          phone: data.shipping.phone,
          country_code: (data.shipping.country || 'CZ').toLowerCase(),
          company: data.shipping.company,
        },
        billing_address: data.useSameAddress
          ? {
              first_name: data.shipping.firstName,
              last_name: data.shipping.lastName,
              address_1: data.shipping.street,
              city: data.shipping.city,
              postal_code: data.shipping.postalCode,
              phone: data.shipping.phone,
              country_code: (data.shipping.country || 'CZ').toLowerCase(),
              company: data.shipping.company,
            }
          : {
              first_name: data.billing.firstName,
              last_name: data.billing.lastName,
              address_1: data.billing.street,
              city: data.billing.city,
              postal_code: data.billing.postalCode,
              country_code: (data.billing.country || 'CZ').toLowerCase(),
              company: data.billing.company,
            },
      })
      setAddressData(data)
    } catch (err) {
      console.error('Failed to update cart with addresses:', err)
      toast.create({
        title: 'Chyba při ukládání adresy',
        description: 'Zkuste to prosím znovu',
        type: 'error',
      })
      throw err
    }
  }

  const {
    data: shippingMethods,
    isLoading: isLoadingShipping,
    error: shippingError,
  } = useQuery({
    queryKey: queryKeys.fulfillment.cartOptions(cart?.id || ''),
    queryFn: async () => {
      if (!cart?.id) throw new Error('No cart ID available')
      const response = await sdk.store.fulfillment.listCartOptions({
        cart_id: cart.id,
      })

      const reducedShippingMethods: ReducedShippingMethod[] =
        response.shipping_options.map((o) => ({
          id: o.id,
          name: o.name,
          calculated_price: o.calculated_price,
          provider_id: (o as any).provider_id,
          data: (o as any).data ?? {},
        }))
      return reducedShippingMethods
    },
    enabled: !!cart?.id,
    ...cacheConfig.semiStatic,
  })

  useEffect(() => {
    const currentMethod = cart?.shipping_methods?.[0]
    if (!currentMethod) return

    if (!selectedShipping) {
      setSelectedShipping(
        (currentMethod as any).shipping_option_id ||
          (currentMethod as any).id ||
          ''
      )
    }

    const existingData = (currentMethod as any).data as
      | Record<string, any>
      | undefined

    if (!existingData?.service) {
      if (balikovnaSelection) {
        setBalikovnaSelection(null)
      }
      return
    }

    if (existingData.service === 'ND') {
      setBalikovnaSelection({ service: 'ND', pickupPoint: undefined })
      return
    }

    if (existingData.pickup_point) {
      const pickup = existingData.pickup_point as any
      setBalikovnaSelection({
        service: (existingData.service as string) as BalikovnaSelection['service'],
        pickupPoint: pickup?.id
          ? {
              id: pickup.id,
              name: pickup.name || 'Balíkovna',
              city: pickup.city,
              street: pickup.street,
              postalCode: pickup.postal_code || pickup.zip,
              type: pickup.type,
              region: pickup.region,
            }
          : undefined,
      })
    }
  }, [cart?.shipping_methods, balikovnaSelection, selectedShipping])

  // Add shipping method to cart
  const addShippingMethod = async (
    methodId: string,
    data?: Record<string, unknown>
  ) => {
    if (!cart?.id) return

    try {
      await sdk.store.cart.addShippingMethod(cart.id, {
        option_id: methodId,
        data,
      })
      await refetch()
    } catch (error) {
      console.error('Failed to add shipping method:', error)
      toast.create({
        title: 'Chyba při výběru dopravy',
        description:
          error instanceof Error
            ? error.message
            : 'Zkuste to prosím znovu',
        type: 'error',
      })
      throw error
    }
  }

  // Process order
  const processOrder = async () => {
    if (!cart?.id) return

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
          title: 'Chyba',
          description: 'Prosím vyberte způsob dopravy',
          type: 'error',
        })
        setCurrentStep(1)
        return
      }

      // Initialize payment if needed
      if (!currentCart.payment_collection) {
        if (!currentCart.region_id) {
          toast.create({
            title: 'Chyba',
            description: 'Košík nemá nastavenou region',
            type: 'error',
          })
          return
        }

        const providers = await sdk.store.payment.listPaymentProviders({
          region_id: currentCart.region_id,
        })

        if (providers.payment_providers?.length > 0) {
          const providerId = providers.payment_providers[0].id
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
        await sdk.store.payment.initiatePaymentSession(latestCart, {
          provider_id: 'pp_system_default',
        })
      }

      // Complete order
      const result = await sdk.store.cart.complete(cart.id)

      if (result.type === 'order') {
        const order = result.order

        // Save completed order data
        if (currentCart) {
          orderHelpers.saveCompletedOrder(currentCart)
        }

        // Clear cart from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEYS.CART_ID)
        }

        clearCart()

        // Invalidate orders cache to refresh the list
        await queryClient.invalidateQueries({
          queryKey: queryKeys.orders.all(),
        })

        // Return success with order data
        return order
      }
    } catch (error) {
      console.error('Order creation error:', error)
      toast.create({
        title: 'Chyba při vytváření objednávky',
        description:
          error instanceof Error
            ? error.message
            : 'Něco se pokazilo. Zkuste to prosím znovu.',
        type: 'error',
      })
      throw error
    } finally {
      setIsProcessingPayment(false)
    }
  }

  // Check if can proceed to step
  const canProceedToStep = (step: number) => {
    const selectedMethod = shippingMethods?.find(
      (m) => m.id === selectedShipping
    )
    const requiresPickup =
      (selectedMethod?.data as Record<string, unknown> | undefined)?.service ===
      'NB'
    switch (step) {
      case 1: // Shipping
        return !!address
      case 2: // Payment
        return (
          !!address &&
          !!selectedShipping &&
          (!requiresPickup || !!balikovnaSelection?.pickupPoint)
        )
      case 3: // Summary
        return !!address && !!selectedShipping && !!selectedPayment
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
    balikovnaSelection,

    // Actions
    setCurrentStep,
    setSelectedPayment,
    setSelectedShipping,
    setAddressData,
    setBalikovnaSelection,
    updateAddresses,
    addShippingMethod,
    processOrder,
    canProceedToStep,
  }
}
