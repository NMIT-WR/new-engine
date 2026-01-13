"use client"
import { Icon, type IconType } from "@techsio/ui-kit/atoms/icon"
import { Select, type SelectItem } from "@techsio/ui-kit/molecules/select"
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

  const items: SelectItem[] = regions.map((region) => ({
    value: region.id,
    label: (
      <span className="flex items-center gap-1">
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
  }))

  return (
    <Select
      className={className}
      items={items}
      onValueChange={handleChange}
      size="xs"
      value={selectedRegion ? [selectedRegion.id] : []}
    >
      <Select.Label className="sr-only">Region</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Region">
            {(selectedItems) =>
              selectedItems[0] ? (
                <span className="flex items-center gap-1">
                  <Icon
                    icon={
                      currencyToIcon[
                        (selectedItems[0].displayValue as string).toUpperCase()
                      ] || "token-icon-globe"
                    }
                  />
                  {selectedItems[0].displayValue}
                </span>
              ) : (
                "Region"
              )
            }
          </Select.ValueText>
        </Select.Trigger>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {items.map((item) => (
            <Select.Item key={item.value} item={item}>
              <Select.ItemText />
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select>
  )
}
