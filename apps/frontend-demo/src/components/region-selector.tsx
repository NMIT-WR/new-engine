'use client'
import { SkeletonLoader } from '@/components/atoms/skeleton-loader'
import { useRegions } from '@/hooks/use-region'
import { Icon, type IconType } from '@ui/atoms/icon'
import { Select } from '@ui/molecules/select'

const currencyToIcon: Record<string, IconType> = {
  CZK: 'token-icon-cz',
  EUR: 'token-icon-eu',
  USD: 'token-icon-usa',
}

export function RegionSelector({ className }: { className?: string }) {
  const { regions, selectedRegion, setSelectedRegion, isLoading } = useRegions()

  if (isLoading || !regions.length) {
    return <SkeletonLoader variant="box" className="hidden h-8 w-28 lg:block" />
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
    label: (
      <span className="flex items-center gap-100">
        <Icon
          icon={
            currencyToIcon[region.currency_code.toUpperCase()] ||
            'token-icon-globe'
          }
        />
        {region.currency_code.toUpperCase()}
      </span>
    ),
    displayValue: region.currency_code.toUpperCase(),
    //label: `${currencyFlags[region.currency_code.toUpperCase()] || '🌍'} ${region.currency_code.toUpperCase()}`,
  }))

  const handleSelect = () => {
    console.log(regions)
  }
  return (
    <Select
      options={options}
      value={selectedRegion ? [selectedRegion.id] : []}
      onValueChange={handleChange}
      size="xs"
      clearIcon={false}
      placeholder="Region"
      className={className}
      onSelect={handleSelect}
    />
  )
}
