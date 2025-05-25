import { HeaderDrawer } from '@/components/HeaderDrawer'
import { HeaderWrapper } from '@/components/HeaderWrapper'
import { Layout, LayoutColumn } from '@/components/Layout'
import { LocalizedLink } from '@/components/LocalizedLink'
import { RegionSwitcher } from '@/components/RegionSwitcher'
import { SearchField } from '@/components/SearchField'
import { listRegions } from '@lib/data/regions'
import * as React from 'react'

import dynamic from 'next/dynamic'

const LoginLink = dynamic(
  () => import('@modules/header/components/LoginLink'),
  { loading: () => <></> }
)

const CartDrawer = dynamic(
  () => import('@/components/CartDrawer').then((mod) => mod.CartDrawer),
  { loading: () => <></> }
)

export const Header = async () => {
  const regions = await listRegions()

  const countryOptions = regions
    .flatMap((r) => {
      return (r.countries ?? []).map((c) => ({
        country: c.iso_2,
        region: r.id,
        label: c.display_name,
      }))
    })
    .sort((a, b) => (a?.label ?? '').localeCompare(b?.label ?? ''))

  return (
    <>
      <HeaderWrapper>
        <Layout>
          <LayoutColumn>
            <div className="flex h-18 items-center justify-between md:h-21">
              <h1 className="font-medium text-md">
                <LocalizedLink href="/">SofaSocietyCo.</LocalizedLink>
              </h1>
              <div className="flex items-center gap-8 max-md:hidden">
                <LocalizedLink href="/about">About</LocalizedLink>
                <LocalizedLink href="/inspiration">Inspiration</LocalizedLink>
                <LocalizedLink href="/store">Shop</LocalizedLink>
              </div>
              <div className="flex items-center gap-3 max-md:hidden lg:gap-6">
                <RegionSwitcher
                  countryOptions={countryOptions}
                  className="w-16"
                  selectButtonClassName="h-auto !gap-0 !p-1 transition-none"
                  selectIconClassName="text-current"
                />
                <React.Suspense>
                  <SearchField countryOptions={countryOptions} />
                </React.Suspense>
                <LoginLink className="p-1 group-data-[light=true]:md:text-white group-data-[sticky=true]:md:text-black" />
                <CartDrawer />
              </div>
              <div className="flex items-center gap-4 md:hidden">
                <LoginLink className="p-1 group-data-[light=true]:md:text-white" />
                <CartDrawer />
                <React.Suspense>
                  <HeaderDrawer countryOptions={countryOptions} />
                </React.Suspense>
              </div>
            </div>
          </LayoutColumn>
        </Layout>
      </HeaderWrapper>
    </>
  )
}
