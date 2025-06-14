'use client'
import { useState } from 'react'
import { Select } from 'ui/src/molecules/select'

export type Region = {
  code: string
  name: string
  currency: string
  flag: string
}

const regions: Region[] = [
  { code: 'eu', name: 'Europe', currency: 'EUR', flag: '🇪🇺' },
  { code: 'us', name: 'United States', currency: 'USD', flag: '🇺🇸' },
]

interface RegionSelectorProps {
  onRegionChange?: (region: Region) => void
}

export function RegionSelector({ onRegionChange }: RegionSelectorProps) {
  const [selectedRegion, setSelectedRegion] = useState(regions[0])

  const handleChange = (details: { value: string[] }) => {
    const regionCode = details.value[0]
    const region = regions.find((r) => r.code === regionCode)
    if (region) {
      setSelectedRegion(region)
      onRegionChange?.(region)
    }
  }

  const options = regions.map((region) => ({
    value: region.code,
    label: `${region.flag} ${region.currency}`,
  }))

  return (
    <Select
      options={options}
      value={[selectedRegion.code]}
      onValueChange={handleChange}
      size="xs"
      className="w-28"
      clearIcon={false}
    />
  )
}
