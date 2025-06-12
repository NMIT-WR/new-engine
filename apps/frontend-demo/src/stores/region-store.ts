import { Store } from '@tanstack/store'

interface RegionState {
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
  
  // Persist to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('medusa_region_id', regionId)
  }
}

export function getSelectedRegionId(): string | null {
  return regionStore.state.selectedRegionId
}

// Initialize from localStorage
if (typeof window !== 'undefined') {
  const storedRegionId = localStorage.getItem('medusa_region_id')
  if (storedRegionId) {
    regionStore.setState({ selectedRegionId: storedRegionId })
  }
}