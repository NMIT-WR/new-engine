'use client'

import { CheckoutReview } from '@/app/pokladna/_components/checkout-review'
import { cacheConfig } from '@/lib/cache-config'
import { queryKeys } from '@/lib/query-keys'
import { getOrderById } from '@/services/order-service'
import { Button } from '@ui/atoms/button'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

export default function OrderPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = params.orderId as string
  const showSuccessBanner = searchParams.get('success') === 'true'

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
