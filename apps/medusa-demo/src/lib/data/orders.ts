'use server'

import { sdk } from '@lib/config'
import { getAuthHeaders } from '@lib/data/cookies'
import { enrichLineItems } from '@lib/util/enrich-line-items'
import medusaError from '@lib/util/medusa-error'
import type { HttpTypes } from '@medusajs/types'
import { cache } from 'react'

export const retrieveOrder = cache(async (id: unknown) => {
  if (typeof id !== 'string') {
    throw new Error('Invalid order id')
  }

  const order = await sdk.client
    .fetch<HttpTypes.StoreOrderResponse>(`/store/orders/${id}`, {
      query: { fields: '*payment_collections.payments' },
      next: { tags: ['orders'] },
      headers: { ...(await getAuthHeaders()) },
    })
    .then(({ order }) => order)
    .catch((err) => medusaError(err))

  if (order.items?.length && order.region_id) {
    order.items = await enrichLineItems(order.items, order.region_id)
  }

  return order
})

export const listOrders = async (limit = 10, offset = 0) => {
  if (
    typeof limit !== 'number' ||
    typeof offset !== 'number' ||
    limit < 1 ||
    offset < 0 ||
    limit > 100 ||
    !Number.isSafeInteger(offset)
  ) {
    throw new Error('Invalid input data')
  }

  return sdk.client
    .fetch<HttpTypes.StoreOrderListResponse>(`/store/orders`, {
      query: { limit, offset, order: '-created_at' },
      next: { tags: ['orders'] },
      headers: { ...(await getAuthHeaders()) },
    })
    .catch((err) => medusaError(err))
}
