import type * as React from 'react'

import { SidebarNav } from '@modules/account/components/SidebarNav'
import { SignOutButton } from '@modules/account/components/SignOutButton'

export default function AccountLayout(props: { children: React.ReactNode }) {
  return (
    <div className="flex max-md:flex-col">
      <div className="sticky top-0 left-0 z-30 w-full shrink-0 bg-white py-2 max-md:top-18 max-md:mt-18 max-md:overflow-x-auto max-md:border-grayscale-200 max-md:border-b md:h-screen md:max-w-75 md:bg-grayscale-50 md:pt-45 md:pb-9 lg:max-w-93">
        <div className="mx-auto flex h-full max-md:sm:container max-md:mx-auto max-md:items-center max-md:px-4 md:max-w-54 md:flex-col md:justify-between">
          <div className="max-md:flex max-md:gap-22">
            <h1 className="mb-14 text-lg max-md:hidden">My account</h1>
            <SidebarNav />
          </div>
          <SignOutButton
            variant="ghost"
            className="justify-start px-0 py-3 max-md:hidden"
          >
            Log out
          </SignOutButton>
        </div>
      </div>
      <div className="w-full overflow-hidden pt-10 pb-26 max-md:sm:container max-md:mx-auto max-md:px-4 md:px-10 md:pt-45 md:pb-36 lg:max-w-200 xl:mx-auto 2xl:ml-30">
        {props.children}
      </div>
    </div>
  )
}
