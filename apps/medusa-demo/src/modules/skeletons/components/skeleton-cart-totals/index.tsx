import { Skeleton } from '@/components/ui/Skeleton'

const SkeletonCartTotals = ({ header = true }) => {
  return (
    <div>
      <div className="flex flex-col gap-4">
        {header && <Skeleton className="h-4 w-32" />}
        <div className="flex justify-between">
          <Skeleton className="h-6 w-25" />
          <Skeleton className="h-6 w-25" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-25" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-6 w-15" />
          <Skeleton className="h-6 w-25" />
        </div>
      </div>
      <hr className="my-6 text-grayscale-200" />
      <div className="mb-11 flex justify-between">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-30" />
      </div>
      <div className="flex justify-between gap-2">
        <Skeleton className="h-12 flex-1 lg:w-50" />
        <Skeleton className="h-12 w-22" />
      </div>
    </div>
  )
}

export default SkeletonCartTotals
