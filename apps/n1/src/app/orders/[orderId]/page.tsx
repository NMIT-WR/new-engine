'use client'

import { CheckoutReview } from '@/app/pokladna/_components/checkout-review'
import { cacheConfig } from '@/lib/cache-config'
import { queryKeys } from '@/lib/query-keys'
import { getOrderById } from '@/services/order-service'
import { useGoogleAds } from '@libs/analytics/google'
import { HeurekaOrder } from '@libs/analytics/heureka'
import { useLeadhub } from '@libs/analytics/leadhub'
import { useMetaPixel } from '@libs/analytics/meta'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@ui/atoms/button'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function OrderPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = params.orderId as string
  const showSuccessBanner = searchParams.get('success') === 'true'

  const { trackPurchase: trackMetaPurchase } = useMetaPixel()
  const { trackPurchase: trackGooglePurchase } = useGoogleAds()
  const { trackPurchase: trackLeadhubPurchase } = useLeadhub()
  const purchaseTracked = useRef(false)

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message?.includes('nenalezena')) {
        return false
      }
      return failureCount < 2
    },
    ...cacheConfig.semiStatic,
  })

  // Analytics - Purchase tracking (only on new purchases with success=true)
  useEffect(() => {
    if (showSuccessBanner && order && !purchaseTracked.current) {
      purchaseTracked.current = true

      const items = order.items || []
      const currency = (order.currency_code ?? 'CZK').toUpperCase()
      const value = order.total ?? 0

      // Meta Pixel - Purchase
      trackMetaPurchase({
        currency,
        value,
        content_ids: items
          .map((item) => item.variant_id)
          .filter((id): id is string => !!id),
        content_type: 'product',
        num_items: items.reduce((sum, item) => sum + (item.quantity || 0), 0),
        contents: items.map((item) => ({
          id: item.variant_id || '',
          quantity: item.quantity || 1,
        })),
      })

      // Google Ads - Purchase conversion
      trackGooglePurchase({
        transaction_id: order.id,
        currency,
        value,
        items: items.map((item) => ({
          item_id: item.variant_id || '',
          item_name: item.title || '',
          quantity: item.quantity || 1,
          price: item.unit_price,
        })),
      })

      // Leadhub - Purchase
      trackLeadhubPurchase({
        email: order.email || '',
        value,
        currency,
        products: items.map((item) => ({
          product_id: item.variant_id || '',
          quantity: item.quantity || 1,
          value: item.unit_price ?? 0,
          currency,
        })),
        order_id: order.id,
        first_name: order.shipping_address?.first_name,
        last_name: order.shipping_address?.last_name,
        phone: order.shipping_address?.phone || undefined,
        address: order.shipping_address
          ? {
              street: [
                order.shipping_address.address_1,
                order.shipping_address.address_2,
              ]
                .filter(Boolean)
                .join(' '),
              city: order.shipping_address.city || undefined,
              zip: order.shipping_address.postal_code || undefined,
              country_code: order.shipping_address.country_code || undefined,
            }
          : undefined,
      })
    }
  }, [
    showSuccessBanner,
    order,
    trackMetaPurchase,
    trackGooglePurchase,
    trackLeadhubPurchase,
  ])

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-500">
        <p className="text-fg-secondary">Načítání objednávky...</p>
      </div>
    )
  }

  // Error state
  if (isError || !order) {
    return (
      <div className="container mx-auto p-500">
        <h1 className="font-bold text-2xl text-fg-primary">
          Objednávka nenalezena
        </h1>
        <p className="mt-200 text-fg-secondary">
          Nepodařilo se načíst detail objednávky.
        </p>
        <Button onClick={() => router.push('/')} className="mt-400">
          Zpět na hlavní stránku
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto min-h-screen p-500">
      {/* Heureka Order Tracking - only on successful new orders */}
      {showSuccessBanner && (
        <HeurekaOrder
          apiKey={process.env.NEXT_PUBLIC_HEUREKA_API_KEY ?? ''}
          orderId={order.id}
          products={(order.items || []).map((item) => ({
            id: item.variant_id || '',
            name: item.title || '',
            priceWithVat: item.unit_price ?? 0,
            quantity: item.quantity || 1,
          }))}
          totalWithVat={order.total ?? 0}
          currency="CZK"
          country="cz"
        />
      )}

      {showSuccessBanner && (
        <div className="mb-500 rounded-lg border border-success bg-success/10 p-400">
          <h2 className="font-semibold text-fg-primary text-lg">
            ✓ Objednávka byla úspěšně vytvořena!
          </h2>
          <p className="mt-100 text-fg-secondary text-sm">
            Děkujeme za vaši objednávku. Potvrzení jsme vám odeslali na e-mail.
          </p>
        </div>
      )}

      <CheckoutReview order={order} />
    </div>
  )
}
