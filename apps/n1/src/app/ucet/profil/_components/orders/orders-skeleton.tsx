import { Skeleton } from "@techsio/ui-kit/atoms/skeleton"

export function OrdersSkeleton({ itemsCount }: { itemsCount: number }) {
  const maxItems = Array.from({ length: Math.min(itemsCount, 10) })

  return (
    <>
      {/* Summary skeleton */}
      <div className="mb-600">
        <div className="mb-400 flex flex-col gap-200 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Skeleton.Rectangle className="mb-100 h-400 w-[200px]" />
            <Skeleton.Rectangle className="h-250 w-[260px]" />
          </div>
          <div className="flex items-center gap-200 sm:block sm:text-right">
            <Skeleton.Rectangle className="h-200 w-[100px] sm:mb-100" />
            <Skeleton.Rectangle className="h-300 w-[130px]" />
          </div>
        </div>

        <div className="flex flex-col gap-200 border-border-secondary border-t pt-300 sm:flex-row sm:items-center sm:gap-400">
          <Skeleton.Rectangle className="h-250 w-[130px]" />
          <Skeleton.Rectangle className="hidden size-100 rounded-full sm:block" />
          <Skeleton.Rectangle className="h-250 w-[100px]" />
          <Skeleton.Rectangle className="hidden size-100 rounded-full sm:block" />
          <Skeleton.Rectangle className="h-250 w-[110px]" />
        </div>
      </div>

      {/* Mobile skeleton */}
      <div className="block space-y-200 sm:hidden">
        {maxItems.map((_, i) => (
          <div
            key={i}
            className="rounded border border-border-secondary bg-base p-300"
          >
            <div className="mb-200 flex items-start justify-between">
              <div>
                <Skeleton.Rectangle className="mb-100 h-250 w-[80px]" />
                <Skeleton.Rectangle className="h-200 w-[120px]" />
              </div>
              <Skeleton.Rectangle className="h-250 w-[80px]" />
            </div>
            <div className="mt-200 flex items-center gap-200">
              <Skeleton.Rectangle className="size-[48px] rounded-full" />
              <div className="flex-1">
                <Skeleton.Rectangle className="mb-100 h-200 w-3/4" />
                <Skeleton.Rectangle className="h-150 w-[60px]" />
              </div>
            </div>
            <div className="mt-200 flex items-center justify-between border-border-tertiary border-t pt-200">
              <Skeleton.Rectangle className="h-250 w-[100px]" />
              <Skeleton.Rectangle className="h-400 w-[100px]" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop skeleton */}
      <div className="hidden sm:block">
        <div className="overflow-hidden rounded border border-border-secondary bg-base">
          {/* Header skeleton */}
          <div className="grid grid-cols-12 gap-300 border-border-secondary border-b bg-surface p-300">
            <Skeleton.Rectangle className="col-span-2 h-200" />
            <Skeleton.Rectangle className="col-span-2 h-200" />
            <Skeleton.Rectangle className="col-span-4 h-200" />
            <Skeleton.Rectangle className="col-span-2 h-200" />
            <Skeleton.Rectangle className="col-span-2 h-200" />
          </div>
          {/* Row skeletons */}
          {maxItems.map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-300 border-border-tertiary border-b p-300"
            >
              <div className="col-span-2">
                <Skeleton.Rectangle className="mb-100 h-200 w-[60px]" />
                <Skeleton.Rectangle className="h-250 w-[80px]" />
              </div>
              <Skeleton.Rectangle className="col-span-2 h-200 w-[100px]" />
              <div className="col-span-4 flex items-center gap-200">
                <div className="-space-x-100 flex">
                  <Skeleton.Rectangle className="size-[40px] rounded-full" />
                  <Skeleton.Rectangle className="size-[40px] rounded-full" />
                </div>
                <Skeleton.Rectangle className="h-200 flex-1" />
              </div>
              <Skeleton.Rectangle className="col-span-2 ml-auto h-200 w-[80px]" />
              <Skeleton.Rectangle className="col-span-2 ml-auto h-350 w-[70px]" />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
