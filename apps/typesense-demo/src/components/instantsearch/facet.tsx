'use client'

import NumericMenu from '@/components/instantsearch/numeric-menu'
import { RangeFilter } from '@/components/instantsearch/range-menu'
import { attributeLabelMap } from '@/lib/schema'
import { useRefinementList } from 'react-instantsearch'

function Facet({ attribute }: { attribute: string }) {
  switch (attribute) {
    case 'categories':
      return (
        <>
          <h3 className="mb-1 font-semibold text-xl">
            {attributeLabelMap[attribute]}
          </h3>
          <div className="flex flex-col gap-2">
            <RefinementListComponent attribute={attribute} />
          </div>
        </>
      )
    case 'price':
      return (
        <>
          <h3 className="mb-1 font-semibold text-xl">
            {attributeLabelMap[attribute]}
          </h3>
          <RangeFilter attribute={attribute} />
        </>
      )
    case 'popularity':
      return (
        <>
          <h3 className="mb-1 font-semibold text-xl">
            {attributeLabelMap[attribute]}
          </h3>
          <NumericMenu
            attribute="popularity"
            items={[
              { label: 'Nízká', end: 100 },
              { label: 'Střední', start: 100, end: 200 },
              { label: 'Vysoká', start: 200 },
            ]}
          />
        </>
      )
    default:
      return null
  }
}

function RefinementListComponent({ attribute }: { attribute: string }) {
  const { items, refine } = useRefinementList({ attribute })

  return (
    <ul>
      {items.map((item) => (
        <li key={item.value}>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={item.isRefined}
              onChange={() => refine(item.value)}
            />
            {item.label} ({item.count})
          </label>
        </li>
      ))}
    </ul>
  )
}

export { Facet }
