import { Skeleton } from "@/components/ui/Skeleton"

const SkeletonCartTotals = ({ header = true }) => {
  return (
    <div>
      <div className="flex flex-col gap-4">
        {header && <Skeleton className="w-32 h-4" />}
        <div className="flex justify-between">
          <Skeleton className="w-25 h-6" />
          <Skeleton className="w-25 h-6" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="w-20 h-6" />
          <Skeleton className="w-25 h-6" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="w-15 h-6" />
          <Skeleton className="w-25 h-6" />
        </div>
      </div>
      <hr className="my-6 text-grayscale-200" />
      <div className="flex justify-between mb-11">
        <Skeleton className="w-20 h-8" />
        <Skeleton className="w-30 h-8" />
      </div>
      <div className="flex justify-between gap-2">
        <Skeleton className="flex-1 lg:w-50 h-12" />
        <Skeleton className="w-22 h-12" />
      </div>
    </div>
  )
}

export default SkeletonCartTotals
