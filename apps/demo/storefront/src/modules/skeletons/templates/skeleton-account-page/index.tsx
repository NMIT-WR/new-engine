import { Skeleton } from "@/components/ui/Skeleton"
import SkeletonButton from "@modules/skeletons/components/skeleton-button"

const SkeletonAccountPage = () => {
  return (
    <>
      <Skeleton className="h-11 w-75 mb-8 md:mb-16" />
      <Skeleton className="h-9 w-60 mb-6" />
      <div className="w-full border border-grayscale-200 rounded-xs p-4 flex flex-wrap gap-8 max-lg:flex-col lg:items-center mb-16">
        <div className="flex gap-8 flex-1">
          <Skeleton className="h-6 w-6 mt-2.5" />
          <div className="flex max-sm:flex-col sm:flex-wrap gap-6 sm:gap-x-16">
            <div>
              <Skeleton className="h-4 w-14 mb-1.5" />
              <Skeleton className="h-6 w-22" />
            </div>
            <div>
              <Skeleton className="h-4 w-14 mb-1.5" />
              <Skeleton className="h-6 w-22" />
            </div>
          </div>
        </div>
        <SkeletonButton className="w-full lg:w-27" />
      </div>
      <Skeleton className="h-9 w-60 mb-6" />
      <div className="w-full border border-grayscale-200 rounded-xs p-4 flex flex-wrap gap-y-6 gap-x-8 items-center mb-4">
        <Skeleton className="h-6 w-6 mt-2.5" />
        <div>
          <Skeleton className="h-4 w-14 mb-1.5" />
          <Skeleton className="h-6 w-40" />
        </div>
      </div>
    </>
  )
}

export default SkeletonAccountPage
