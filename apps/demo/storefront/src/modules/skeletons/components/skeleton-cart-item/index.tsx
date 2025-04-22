import { Skeleton } from "@/components/ui/Skeleton"

const SkeletonCartItem = () => {
  return (
    <div className="flex gap-6 border-b border-grayscale-100 py-8 lg:last:pb-0 lg:last:border-b-0">
      <Skeleton className="w-25 sm:w-30 aspect-[3/4]" />
      <div className="flex-grow flex flex-col justify-between">
        <div className="flex gap-1 flex-col">
          <Skeleton className="h-7 md:h-6 w-34 md:w-39" />
          <Skeleton className="h-5 md:h-5 w-24 md:w-32 max-sm:mb-2" />
          <Skeleton className="sm:hidden h-4 w-20" />
        </div>
        <Skeleton className="w-25 h-8" />
      </div>
      <div className="flex flex-col justify-between items-end">
        <Skeleton className="max-sm:hidden w-22 h-6" />
        <Skeleton className="h-6 w-6 md:h-8 md:w-8" />
      </div>
    </div>
  )
}

export default SkeletonCartItem
