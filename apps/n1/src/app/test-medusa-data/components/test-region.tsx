'use client'

import { useRegion } from '@libs/medusa-data/hooks'

export function TestRegion() {
  const {
    regions,
    selectedRegion,
    regionId,
    countryCode,
    currencyCode,
    isLoading,
  } = useRegion()

  if (isLoading) {
    return <div className="text-fg-secondary">Loading region data...</div>
  }

  return (
    <div className="flex flex-col gap-300">
      <div className="grid grid-cols-2 gap-400 text-sm">
        <div>
          <span className="font-medium text-fg-primary">Region ID:</span>{' '}
          <code className="bg-surface px-100 rounded text-fg-secondary">
            {regionId || 'N/A'}
          </code>
        </div>
        <div>
          <span className="font-medium text-fg-primary">Country Code:</span>{' '}
          <code className="bg-surface px-100 rounded text-fg-secondary">
            {countryCode}
          </code>
        </div>
        <div>
          <span className="font-medium text-fg-primary">Currency:</span>{' '}
          <code className="bg-surface px-100 rounded text-fg-secondary">
            {currencyCode}
          </code>
        </div>
        <div>
          <span className="font-medium text-fg-primary">Total Regions:</span>{' '}
          <code className="bg-surface px-100 rounded text-fg-secondary">
            {regions.length}
          </code>
        </div>
      </div>

      {selectedRegion && (
        <details className="mt-200">
          <summary className="cursor-pointer text-sm text-fg-secondary">
            Show raw region data
          </summary>
          <pre className="mt-200 p-200 bg-surface rounded text-3xs overflow-auto max-h-[200px]">
            {JSON.stringify(selectedRegion, null, 2)}
          </pre>
        </details>
      )}
    </div>
  )
}
