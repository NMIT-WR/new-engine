"use client"

import { LayoutColumn } from "@/components/Layout"
import { Link } from "@/components/Link"
import { usePathname } from "next/navigation"

export const NoResults = () => {
  const pathname = usePathname()

  return (
    <LayoutColumn className="pt-28">
      <div className="flex justify-center flex-col items-center">
        <div>
          <p className="text-md text-center mb-2">No results match!</p>
        </div>
        <Link
          scroll={false}
          href={pathname}
          variant="underline"
          className="inline-flex md:pb-0"
        >
          Clear filters
        </Link>
      </div>
    </LayoutColumn>
  )
}
