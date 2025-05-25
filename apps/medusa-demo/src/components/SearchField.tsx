'use client'

import { Button } from '@/components/Button'
import { Icon } from '@/components/Icon'
import { getProductsById } from '@lib/data/products'
import { type MeiliSearchProductHit, searchClient } from '@lib/search-client'
import { getProductPrice } from '@lib/util/get-product-price'
import Thumbnail from '@modules/products/components/thumbnail'
import { useCountryCode } from 'hooks/country-code'
import type { Hit } from 'meilisearch'
import { useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import * as ReactAria from 'react-aria-components'
import { useAsyncList } from 'react-stately'
import { twJoin } from 'tailwind-merge'

interface ListItem extends Hit<MeiliSearchProductHit> {
  price: {
    calculated_price_number: number
    calculated_price: string
    original_price_number: number | null
    original_price: string
    currency_code: string | null
    price_type: string | null | undefined
    percentage_diff: string
  } | null
}

export const SearchField: React.FC<{
  countryOptions: {
    country: string | undefined
    region: string
    label: string | undefined
  }[]
  isInputAlwaysShown?: boolean
}> = ({ countryOptions, isInputAlwaysShown }) => {
  const router = useRouter()
  const [isInputShown, setIsInputShown] = React.useState(false)
  const countryCode = useCountryCode()
  const region = countryOptions.find((co) => co.country === countryCode)?.region
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('query')

  const list = useAsyncList<ListItem>({
    getKey(item) {
      return item.handle
    },
    load: async ({ filterText, signal }) => {
      const results = await searchClient
        .index('products')
        .search<MeiliSearchProductHit>(filterText, undefined, {
          signal,
        })
      const medusaProducts = await getProductsById({
        ids: results.hits.map((h) => h.id),
        regionId: region!,
      })

      return {
        items: results.hits.map((hit) => {
          const product = medusaProducts.find((p) => p.id === hit.id)
          return {
            ...hit,
            price: getProductPrice({
              product: product!,
            }).cheapestPrice,
          }
        }),
        filterText,
      }
    },
    initialFilterText: searchQuery ?? '',
  })

  const buttonPressHandle = React.useCallback(() => {
    if (!isInputShown) {
      setIsInputShown(true)
    } else if (list.filterText) {
      router.push(`/${countryCode}/search?query=${list.filterText}`)
      if (!isInputAlwaysShown) setIsInputShown(false)
    } else if (!isInputAlwaysShown) setIsInputShown(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInputShown, list.filterText, router, countryCode])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!isInputAlwaysShown) setIsInputShown(false)
      } else if (e.key === 'Enter' && list.filterText) {
        router.push(`/${countryCode}/search?query=${list.filterText}`)
        if (!isInputAlwaysShown) setIsInputShown(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list.filterText, router, countryCode]
  )

  React.useEffect(() => {
    if (searchQuery && !list.filterText) {
      list.setFilterText(searchQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  React.useEffect(() => {
    if (isInputAlwaysShown) setIsInputShown(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex">
      <Button
        onClick={buttonPressHandle}
        variant="ghost"
        className="p-1 max-md:text-white group-data-[light=true]:md:text-white group-data-[sticky=true]:md:text-black"
        aria-label="Open search"
      >
        <Icon name="search" className="h-5 w-5" />
      </Button>{' '}
      <ReactAria.ComboBox
      /*allowsCustomValue
            className="overflow-hidden"
            aria-label="Search"
            items={list.items}
            inputValue={list.filterText}
            onInputChange={list.setFilterText}
            onKeyDown={handleKeyDown}
            isDisabled={!isInputAlwaysShown && !isInputShown}*/
      >
        <div
          className={twJoin(
            'h-full max-w-40 overflow-hidden transition-width duration-500 md:max-w-30',
            isInputShown ? 'w-full md:w-30' : 'md:w-0'
          )}
        >
          <input
            type="text"
            className="!py-0 h-7 w-full rounded-none border-black border-x-0 border-t-0 px-0 disabled:bg-transparent max-md:border-0 md:h-6 group-data-[light=true]:md:border-white group-data-[sticky=true]:md:border-black"
            value={list.filterText}
            onChange={(e) => list.setFilterText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isInputAlwaysShown && !isInputShown}
          />
        </div>
        <ReactAria.Popover
          placement="bottom end"
          containerPadding={10}
          maxHeight={243}
          offset={25}
          className="w-full max-w-90 overflow-y-scroll rounded-xs border border-grayscale-200 bg-white md:max-w-95 lg:max-w-98"
        >
          <ReactAria.ListBox className="outline-none">
            {(item: ListItem) =>
              (
                <ReactAria.ListBoxItem
                      className='after:-bottom-px relative mb-px flex gap-6 p-6 transition-colors after:absolute after:right-6 after:left-6 after:h-px after:bg-grayscale-100 after:content-[''] last:after:hidden hover:bg-grayscale-50'
                      key={item.handle}
                      id={item.handle}
                      href={`/${countryCode}/products/${item.handle}`}
                  >
                    <Thumbnail
                        thumbnail={item.thumbnail}
                        size="3/4"
                        className="w-20"
                    />
                    <div>
                      <p className='font-normal text-base'>{item.title}</p>
                      <p className="text-grayscale-500 text-xs">
                        {item.variants &&
                            item.variants.length > 0 &&
                            item.variants[0]}
                      </p>
                    </div>
                    <p className='ml-auto font-semibold text-base'>
                      {item.price?.calculated_price}
                    </p>
                  </ReactAria.ListBoxItem>
              )
            }
          </ReactAria.ListBox>
        </ReactAria.Popover>
      </ReactAria.ComboBox>
    </div>
  )
}
