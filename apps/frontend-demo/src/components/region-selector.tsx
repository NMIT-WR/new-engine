"use client"
import { Icon, type IconType } from "@techsio/ui-kit/atoms/icon"
import { Select } from "@techsio/ui-kit/molecules/select"
import { SkeletonLoader } from "@/components/atoms/skeleton-loader"
import { useRegions } from "@/hooks/use-region"

const currencyToIcon: Record<string, IconType> = {
  CZK: "token-icon-cz",
  EUR: "token-icon-eu",
  USD: "token-icon-usa",
}

export function RegionSelector({ className }: { className?: string }) {
  const { regions, selectedRegion, setSelectedRegion, isLoading } = useRegions()

  if (isLoading || !regions.length) {
    return <SkeletonLoader className="hidden h-8 w-28 lg:block" variant="box" />
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
            "token-icon-globe"
          }
        />
        {region.currency_code.toUpperCase()}
      </span>
    ),
    displayValue: region.currency_code.toUpperCase(),
    //label: `${currencyFlags[region.currency_code.toUpperCase()] || '🌍'} ${region.currency_code.toUpperCase()}`,
  }))
  return (
    <Select
      className={className}
      clearIcon={false}
      onValueChange={handleChange}
      options={options}
      placeholder="Region"
      size="xs"
      value={selectedRegion ? [selectedRegion.id] : []}
    />
  )
}
