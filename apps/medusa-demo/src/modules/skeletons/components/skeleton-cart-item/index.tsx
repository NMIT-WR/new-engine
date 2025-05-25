import { Skeleton } from '@/components/ui/Skeleton'

const SkeletonCartItem = () => {
  return (
    <div className="flex gap-6 border-grayscale-100 border-b py-8 lg:last:border-b-0 lg:last:pb-0">
      <Skeleton className="aspect-[3/4] w-25 sm:w-30" />
      <div className="flex flex-grow flex-col justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-7 w-34 md:h-6 md:w-39" />
          <Skeleton className="h-5 w-24 max-sm:mb-2 md:h-5 md:w-32" />
          <Skeleton className="h-4 w-20 sm:hidden" />
        </div>
        <Skeleton className="h-8 w-25" />
      </div>
      <div className="flex flex-col items-end justify-between">
        <Skeleton className="h-6 w-22 max-sm:hidden" />
        <Skeleton className="h-6 w-6 md:h-8 md:w-8" />
      </div>
    </div>
  )
}

export default SkeletonCartItem
