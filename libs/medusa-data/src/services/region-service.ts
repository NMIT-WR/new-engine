import type Medusa from '@medusajs/js-sdk'
import type { StoreRegion } from '@medusajs/types'

/**
 * Create region service using Medusa SDK
 */
export function createRegionService(sdk: Medusa) {
  /**
   * Fetch all regions from Medusa
   */
  async function getRegions(): Promise<StoreRegion[]> {
    const response = await sdk.store.region.list()
    return response.regions
  }

  return {
    getRegions,
  }
}
