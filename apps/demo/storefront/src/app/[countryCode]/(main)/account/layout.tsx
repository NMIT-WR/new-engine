import * as React from "react"

import { SignOutButton } from "@modules/account/components/SignOutButton"
import { SidebarNav } from "@modules/account/components/SidebarNav"

export default function AccountLayout(props: { children: React.ReactNode }) {
  return (
    <div className="flex max-md:flex-col">
      <div className="sticky left-0 shrink-0 z-30 top-0 md:max-w-75 lg:max-w-93 py-2 max-md:mt-18 max-md:top-18 md:pt-45 md:pb-9 max-md:border-b max-md:border-grayscale-200 max-md:overflow-x-auto bg-white md:bg-grayscale-50 w-full md:h-screen">
        <div className="md:max-w-54 mx-auto flex max-md:items-center md:flex-col md:justify-between h-full max-md:px-4 max-md:sm:container max-md:mx-auto">
          <div className="max-md:flex max-md:gap-22">
            <h1 className="text-lg mb-14 max-md:hidden">My account</h1>
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
      <div className="max-md:px-4 overflow-hidden max-md:sm:container max-md:mx-auto md:px-10 pt-10 md:pt-45 pb-26 md:pb-36 w-full lg:max-w-200 xl:mx-auto 2xl:ml-30">
        {props.children}
      </div>
    </div>
  )
}
