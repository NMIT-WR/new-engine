'use client'

import { useEffect, useState } from 'react'
import { sdk } from '@/lib/medusa-client'

export function useRegions() {
  const [regions, setRegions] = useState<any[]>([])
  const [selectedRegion, setSelectedRegion] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRegions() {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await sdk.store.region.list()
        setRegions(response.regions)
        
        // Select US region by default or first available
        const usRegion = response.regions.find(r => r.currency_code === 'usd')
        setSelectedRegion(usRegion || response.regions[0])
      } catch (err) {
        console.error('Failed to fetch regions:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch regions')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRegions()
  }, [])

  return { regions, selectedRegion, setSelectedRegion, isLoading, error }
}

// Hook to get current region (can be expanded to use localStorage)
export function useCurrentRegion() {
  const { selectedRegion, isLoading, error } = useRegions()
  return { region: selectedRegion, isLoading, error }
}