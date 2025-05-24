import { Suspense } from 'react'

import { listRegions } from '@lib/data/regions'
import type { StoreRegion } from '@medusajs/types'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import CartButton from '@modules/layout/components/cart-button'
import SideMenu from '@modules/layout/components/side-menu'

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="group sticky inset-x-0 top-0 z-50">
      <header className="relative mx-auto h-16 border-ui-border-base border-b bg-white duration-200">
        <nav className="txt-xsmall-plus flex h-full w-full items-center justify-between text-small-regular text-ui-fg-subtle content-container">
          <div className="flex h-full flex-1 basis-0 items-center">
            <div className="h-full">
              <SideMenu regions={regions} />
            </div>
          </div>

          <div className="flex h-full items-center">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus uppercase hover:text-ui-fg-base"
              data-testid="nav-store-link"
            >
              Medusa Store
            </LocalizedClientLink>
          </div>

          <div className="flex h-full flex-1 basis-0 items-center justify-end gap-x-6">
            <div className="hidden h-full items-center gap-x-6 small:flex">
              {process.env.NEXT_PUBLIC_FEATURE_SEARCH_ENABLED && (
                <LocalizedClientLink
                  className="hover:text-ui-fg-base"
                  href="/search"
                  scroll={false}
                  data-testid="nav-search-link"
                >
                  Search
                </LocalizedClientLink>
              )}
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex gap-2 hover:text-ui-fg-base"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
