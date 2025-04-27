'use client'
import { Card } from '@/components/ui/card'
import type { typesenseSchema } from '@/lib/schema'
import { Package, Tag } from 'lucide-react'
import type { z } from 'zod'

type Item = z.infer<typeof typesenseSchema>

function formatPrice(price: number) {
  return `${price.toFixed(2)} Kč`
}

export default function Hit({ hit }: { hit: Item }) {
  return (
    <div className="flex aspect-3/4 w-full flex-col pb-[10px] transition-all">
      <Card className="relative flex flex-col items-center rounded-lg bg-white p-4 transition-all hover:shadow-xl dark:bg-zinc-900">
        {hit.image && (
          <div className="mb-4 h-48 w-full">
            <img
              src={hit.image}
              alt={hit.name}
              className="h-full w-full object-contain"
            />
          </div>
        )}
        <div className="mb-4 w-full">
          <h3 className="truncate font-bold text-xl tracking-tight">
            {hit.name}
          </h3>
          <p className="text-muted-foreground text-sm">{hit.description}</p>
        </div>
        <div className="mb-2 flex w-full justify-between">
          {hit.brand && (
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Package size={16} />
              <span>{hit.brand}</span>
            </div>
          )}
          {hit.categories && (
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Tag size={16} />
              <span>{hit.categories.join(', ')}</span>
            </div>
          )}
        </div>
        <div className="absolute right-0 bottom-0 mr-3 mb-[-16px] rounded-lg border-2 border-green-400 bg-green-50 px-2 py-1 font-extrabold text-green-400 dark:border-background dark:bg-green-800">
          <h1 className="text-xl">{formatPrice(hit.price)}</h1>
        </div>
      </Card>
    </div>
  )
}
