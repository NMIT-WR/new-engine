'use server'

import { sdk } from '@lib/config'
import type { HttpTypes } from '@medusajs/types'
import { getAuthHeaders, getCacheOptions } from './cookies'

export const listCartPaymentMethods = async (regionId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions('payment_providers')),
  }

  return sdk.client
    .fetch<HttpTypes.StorePaymentProviderListResponse>(
      `/store/payment-providers`,
      {
        method: 'GET',
        query: { region_id: regionId },
        headers,
        next,
        cache: 'force-cache',
      }
    )
    .then(({ payment_providers }) =>
      payment_providers.sort((a, b) => {
        return a.id > b.id ? 1 : -1
      })
    )
    .catch(() => {
      return null
    })
}
