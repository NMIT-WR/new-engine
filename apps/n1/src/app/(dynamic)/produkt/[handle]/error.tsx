"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@techsio/ui-kit/atoms/button"
import { useParams } from "next/navigation"
import { queryKeys } from "@/lib/query-keys"

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorProduct({ reset }: ErrorProps) {
  const queryClient = useQueryClient()
  const params = useParams()
  const handle = typeof params.handle === "string" ? params.handle : undefined

  const handleRetry = () => {
    queryClient.resetQueries({ queryKey: queryKeys.regions() })

    if (handle) {
      queryClient.resetQueries({
        queryKey: [...queryKeys.products.all(), "detail", handle],
      })
    } else {
      queryClient.resetQueries({ queryKey: queryKeys.products.all() })
    }

    reset()
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded border border-danger p-600 text-center">
        <p className="mb-200 font-semibold text-danger">
          Chyba při načítání produktu
        </p>
        <p className="mb-400 text-fg-secondary">
          Produkt nebyl nalezen nebo došlo k chybě při načítání.
        </p>
        <div className="flex justify-center">
          <Button
            onClick={handleRetry}
            size="sm"
            theme="solid"
            variant="secondary"
          >
            Zkusit znovu
          </Button>
        </div>
      </div>
    </div>
  )
}
