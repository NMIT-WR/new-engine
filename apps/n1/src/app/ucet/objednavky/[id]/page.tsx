'use client'

import { SkeletonLoader } from '@/app/ucet/objednavky/[id]/_components/skeleton-loader'
import { useOrder } from '@/hooks/use-orders'
import { formatDateString } from '@/utils/format/format-date'
import {
  getOrderStatusColor,
  getOrderStatusLabel,
} from '@/utils/format/format-order-status'
import { Badge } from '@techsio/ui-kit/atoms/badge'
import { LinkButton } from '@techsio/ui-kit/atoms/link-button'
import Link from 'next/link'
import { use } from 'react'
import { useAccountContext } from '../../context/account-context'
import { OrderDetail } from './_components/order-detail'

interface OrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params)
  const { data: order, isLoading, error } = useOrder(id)
  const { setActiveTab } = useAccountContext()

  // Error - throw pro error.tsx boundary
  if (error) {
    throw error
  }

  // Loading - client-side fetch (loading.tsx je pro route transition)
  if (isLoading || !order) {
    return (
      <div className="space-y-400">
        <SkeletonLoader className="h-500 w-4xl" />
        <SkeletonLoader className="h-[160px] w-full" />
        <SkeletonLoader className="h-[400px] w-full" />
      </div>
    )
  }

  const statusVariant = getOrderStatusColor(order.status || 'pending')

  return (
    <div className="mx-auto max-w-max-w px-400">
      <LinkButton
        as={Link}
        href="/ucet/profil"
        theme="unstyled"
        size="current"
        className="mb-400"
        icon="token-icon-arrow-left"
        onClick={() => setActiveTab('orders')}
      >
        Zpět na objednávky
      </LinkButton>
      <div className="mb-500">
        <div className="flex flex-col gap-200 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-bold text-fg-primary text-xl">
              Objednávka #{order.display_id}
            </h1>
            <p className="text-fg-secondary">
              {formatDateString(order.created_at as string, {
                month: 'long',
                year: 'numeric',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex flex-wrap gap-200">
            <Badge variant={statusVariant}>
              {getOrderStatusLabel(order.status)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <OrderDetail order={order} />
    </div>
  )
}
