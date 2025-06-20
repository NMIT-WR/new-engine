'use client'
import { SkeletonLoader } from '@/components/atoms/skeleton-loader'
import { useRegions } from '@/hooks/use-region'
import { Select } from '@ui/molecules/select'

const currencyFlags: Record<string, string> = {
  EUR: '🇪🇺',
  USD: '🇺🇸',
  GBP: '🇬🇧',
  SEK: '🇸🇪',
  DKK: '🇩🇰',
  NOK: '🇳🇴',
  PLN: '🇵🇱',
  CZK: '🇨🇿',
}

export function RegionSelector() {
  const { regions, selectedRegion, setSelectedRegion, isLoading } = useRegions()

  if (isLoading || !regions.length) {
    return <SkeletonLoader variant="box" className="h-8 w-28" />
  }

  const handleChange = (details: { value: string[] }) => {
    const regionId = details.value[0]
    const region = regions.find((r) => r.id === regionId)
    if (region) {
      setSelectedRegion(region)
    }
  }

  const options = regions.map((region) => ({
    value: region.id,
    label: `${currencyFlags[region.currency_code.toUpperCase()] || '🌍'} ${region.currency_code.toUpperCase()}`,
  }))

  return (
    <Select
      options={options}
      value={selectedRegion ? [selectedRegion.id] : []}
      onValueChange={handleChange}
      size="xs"
      className="w-28"
      clearIcon={false}
      placeholder="Region"
    />
  )
}
