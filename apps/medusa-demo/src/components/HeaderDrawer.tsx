'use client'

import { Button } from '@/components/Button'
import { Drawer } from '@/components/Drawer'
import { Icon } from '@/components/Icon'
import { LocalizedLink } from '@/components/LocalizedLink'
import { RegionSwitcher } from '@/components/RegionSwitcher'
import { SearchField } from '@/components/SearchField'
import { useSearchParams } from 'next/navigation'
import * as React from 'react'

export const HeaderDrawer: React.FC<{
  countryOptions: {
    country: string | undefined
    region: string
    label: string | undefined
  }[]
}> = ({ countryOptions }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('query')

  React.useEffect(() => {
    if (searchQuery) setIsMenuOpen(false)
  }, [searchQuery])

  return (
    <>
      <Button
        variant="ghost"
        className="p-1 group-data-[light=true]:md:text-white"
        onPress={() => setIsMenuOpen(true)}
        aria-label="Open menu"
      >
        <Icon name="menu" className="h-6 w-6" wrapperClassName="w-6 h-6" />
      </Button>
      <Drawer
        animateFrom="left"
        isOpen={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        className="!p-0 rounded-none"
      >
        {({ close }) => (
          <>
            <div className="flex h-full flex-col text-white">
              <div className="mb-8 flex w-full items-center justify-between border-white border-b px-8 pt-5 pb-6">
                <SearchField
                  countryOptions={countryOptions}
                  isInputAlwaysShown
                />
                <button onClick={close} aria-label="Close menu">
                  <Icon name="close" className="w-6" />
                </button>
              </div>
              <div className="flex flex-col gap-8 px-8 font-medium text-lg">
                <LocalizedLink
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </LocalizedLink>
                <LocalizedLink
                  href="/inspiration"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inspiration
                </LocalizedLink>
                <LocalizedLink
                  href="/store"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop
                </LocalizedLink>
              </div>
              <RegionSwitcher
                countryOptions={countryOptions}
                className="mt-auto mb-8 ml-8"
                selectButtonClassName="max-md:text-base gap-2 p-1 w-auto"
                selectIconClassName="text-current w-6 h-6"
              />
            </div>
          </>
        )}
      </Drawer>
    </>
  )
}
