'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

import SortProducts, { type SortOptions } from './sort-products'

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  'data-testid'?: string
}

const RefinementList = ({
  sortBy,
  'data-testid': dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  return (
    <div className="mb-8 flex gap-12 py-4 pl-6 small:ml-[1.675rem] small:min-w-[250px] small:flex-col small:px-0">
      <SortProducts
        sortBy={sortBy}
        setQueryParams={setQueryParams}
        data-testid={dataTestId}
      />
    </div>
  )
}

export default RefinementList
