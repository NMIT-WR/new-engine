import { Store } from '@tanstack/react-store'
import { storage, STORAGE_KEYS } from '@/lib/local-storage'

export interface RegionState {
  selectedRegionId: string | null
}

export const regionStore = new Store<RegionState>({
  selectedRegionId: null,
})

// Helper functions
export function setSelectedRegionId(regionId: string) {
  regionStore.setState((state) => ({
    ...state,
    selectedRegionId: regionId,
  }))

  // Persist to localStorage using centralized utility
  storage.set(STORAGE_KEYS.REGION_ID, regionId)
}

// Initialize from localStorage on client side
if (typeof window !== 'undefined') {
  const storedRegionId = storage.get<string>(STORAGE_KEYS.REGION_ID)
  if (storedRegionId) {
    regionStore.setState({ selectedRegionId: storedRegionId })
  }
}